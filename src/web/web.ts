import express, { Express } from "express"
import fs from 'fs';
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export function InitializeInterface(app: Express, io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, cacheDatas?: any) {
  app.use(express.static(`${__dirname}/static`));

  app.get("/interface", function (request, result) {
    result.sendFile(`${__dirname}/static/index.html`);
  });

  io.on('connection', (socket) => {
    console.log('connected')
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('requestAllData', function (args: any[]) {
      if (cacheDatas["enable"]) {
        setInterval(function() {
          let data = {};
          for (const value of cacheDatas["categories"]) {
            const path = `${__dirname}/static/data/${value}.openpm`
            if (fs.existsSync(path)) {
              const lines = fs.readFileSync(path).toString().split("\n");
              for (const line of lines) {
                if (line.length > 0) {
                  let parseLine = JSON.parse(line);
                  if (!(data as any)[(parseLine as any)[0]["mainType"]]) {
                    (data as any)[(parseLine as any)[0]["mainType"]] = [];
                  }
                  (data as any)[(parseLine as any)[0]["mainType"]].push(parseLine);
                }
              }
            }
          }
          socket.emit('receiveData', data);
        }, cacheDatas["interval"])
      }
    })
  })
}
