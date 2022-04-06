import { utilExecCommand } from './exec';

export function fetchPiData(main: string, sub?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    utilExecCommand("sh", [`./src/shell/${main}.sh`], (data: string) => {
      let proccessedData = proccessFetchedData(data, main);
      let fetchedData: any = proccessedData;
      if (sub != undefined) {
        fetchedData = (proccessedData as any)[sub];
      }
      resolve(fetchedData);
    }, (data: string) => {
      reject(data);
    })
  });
}

function proccessFetchedData(data: string, dataType: string): object {
  let cleanedData = data.split(" ").filter(n => n).map(n => n.replace(/(\r\n|\n|\r)/gm, ""));
  switch (dataType) {
    case "cpu":
      return {
        temp: parseFloat(cleanedData[0]) / 1000,
        load: cleanedData[1]
      };
    case "gpu":
      return {
        temp: cleanedData[0]
      };
    case "memory":
      return {
        total: parseInt(cleanedData[1]),
        free: parseInt(cleanedData[3]),
        used: parseInt(cleanedData[1]) - parseInt(cleanedData[3])
      };
    case "storage":
      return {
        total: cleanedData[1],
        used: cleanedData[2],
        free: cleanedData[3]
      };
  }
  return {};
}