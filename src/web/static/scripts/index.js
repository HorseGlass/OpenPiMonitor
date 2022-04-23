function addData(chart, label, data) {
  chart.data.labels.push(label);
  chart.data.datasets.forEach((dataset) => {
    dataset.data.push(data);
  });
  chart.update();
}

function removeData(chart) {
  chart.data.labels.shift();
  chart.data.datasets.forEach((dataset) => {
    dataset.data.shift();
  });
  chart.update();
}

let charts;
let chartsjs = {};
let addedUIDs = {};

const chartColors = {
  cpu: {
    temp: 'rgba(46, 204, 113,0.6)',
    load: 'rgba(231, 76, 60,0.6)',
  },
  gpu: {
    temp: 'rgba(46, 204, 113,0.6)',
  }
}

jQuery(document).ready(function ($) {
  charts = {
    cpu: {
      temp: $('#cpu-temp'),
      load: $('#cpu-load')
    },
    gpu: {
      temp: $('#gpu-temp')
    },
    memory: {
      pie: $('#memory-pie'),
      load: $('#memory-load')
    },
    storage: {
      pie: $('#storage-pie')
    }
  };
  const socket = io();
  socket.emit('requestAllData');
  socket.on('receiveData', updateCharts);
});

function updateCharts(args) {
  let chartData = args;
  updateCPU(chartData);
  updateGPU(chartData);
  updateStorage(chartData);
  updateMemory(chartData);
}

function updateCPU(chartData) {
  if (chartData["cpu"] != undefined) {
    if (!chartsjs['cpu']) {chartsjs['cpu'] = {};addedUIDs['cpu'] = {};};
    for (const cpuData of chartData["cpu"]) {
      for (const cpuDataField of cpuData) {
        let subType = cpuDataField['subType'];
        if (!chartsjs['cpu'][subType]) {
          addedUIDs['cpu'][subType] = {};
          chartsjs['cpu'][subType] = new Chart(charts['cpu'][subType], {
            type: 'line',
            data: {
              labels: [],
              datasets: [
                {
                  label: 'cpu ' + subType,
                  data: [],
                  fill: false,
                  borderColor: chartColors['cpu'][subType],
                  backgroundColor: chartColors['cpu'][subType],
                  tension: 0.2
                }
              ]
            },
            options: {
              aspectRatio: 1.9
            }
          })
        }
        if (chartsjs['cpu'][subType].data.labels.length + 1 > 10) {
          removeData(chartsjs['cpu'][subType]);
        }
        if (addedUIDs['cpu'][subType][cpuDataField["uid"]] == undefined) {
          let data = cpuDataField['value'];
          if (subType == 'load') {
            data = parseInt(data.replace('%', ''));
          }
          addedUIDs['cpu'][subType][cpuDataField['uid']] = true;
          const label = cpuDataField["date"].split('T')[1].split('.')[0];
          addData(chartsjs['cpu'][subType], label, data);
        }
      }
    }
  }
}

function updateGPU(chartData) {
  if (chartData["gpu"] != undefined) {
    if (!chartsjs['gpu']) {chartsjs['gpu'] = {};addedUIDs['gpu'] = {};};
    for (const gpuData of chartData["gpu"]) {
      for (const gpuDataField of gpuData) {
        let subType = gpuDataField['subType'];
        if (!chartsjs['gpu'][subType]) {
          addedUIDs['gpu'][subType] = {};
          chartsjs['gpu'][subType] = new Chart(charts['gpu'][subType], {
            type: 'line',
            data: {
              labels: [],
              datasets: [
                {
                  label: 'gpu ' + subType,
                  data: [],
                  fill: false,
                  borderColor: chartColors['gpu'][subType],
                  backgroundColor: chartColors['gpu'][subType],
                  tension: 0.2
                }
              ]
            },
            options: {
              aspectRatio: 1.9
            }
          })
        }
        if (chartsjs['gpu'][subType].data.labels.length + 1 > 10) {
          removeData(chartsjs['gpu'][subType]);
        }
        if (addedUIDs['gpu'][subType][gpuDataField["uid"]] == undefined) {
          addedUIDs['gpu'][subType][gpuDataField['uid']] = true;
          const label = gpuDataField["date"].split('T')[1].split('.')[0];
          addData(chartsjs['gpu'][subType], label, parseFloat(gpuDataField['value'].split("'")[0]));
        }
      }
    }
  }
}

function updateStorage(chartData) {
  if (chartData["storage"] != undefined) {
    if (!chartsjs['storage']) {chartsjs['storage'] = {};addedUIDs['storage'] = {};};
    for (const storageData of chartData["storage"]) {
      for (const storageDataField of storageData) {
        let subType = 'pie';
        if (!chartsjs['storage'][subType]) {
          addedUIDs['storage'][subType] = {};
          chartsjs['storage'][subType] = new Chart(charts['storage'][subType], {
            type: 'pie',
            data: {
              labels: ['Free', 'Used'],
              datasets: [
                {
                  label: 'Storage',
                  data: [1000, 500],
                  backgroundColor: [
                    'rgba(46, 204, 113,1.0)',
                    'rgba(231, 76, 60,1.0)'
                  ]
                }
              ]
            },
            options: {
              aspectRatio: 2.2
            }
          })
        }
        if (storageDataField['subType'] === 'free') {
          chartsjs['storage'][subType].data.datasets[0].data[0] = parseInt(storageDataField['value'].replace('G', ''));
        } else if (storageDataField['subType'] === 'used') {
          chartsjs['storage'][subType].data.datasets[0].data[1] = parseInt(storageDataField['value'].replace('G', ''));
        }
        chartsjs['storage'][subType].update();
      }
    }
  }
}

function updateMemory(chartData) {
  if (chartData["memory"] != undefined) {
    if (!chartsjs['memory']) {chartsjs['memory'] = {};addedUIDs['memory'] = {};};
    for (const memoryData of chartData["memory"]) {
      for (const memoryDataField of memoryData) {
        let subType = 'pie';
        if (!chartsjs['memory'][subType]) {
          addedUIDs['memory'][subType] = {};
          chartsjs['memory'][subType] = new Chart(charts['memory'][subType], {
            type: 'pie',
            data: {
              labels: ['Free', 'Used'],
              datasets: [
                {
                  label: 'memory',
                  data: [1000, 500],
                  backgroundColor: [
                    'rgba(46, 204, 113,1.0)',
                    'rgba(231, 76, 60,1.0)'
                  ]
                }
              ]
            },
            options: {
              aspectRatio: 2.2
            }
          });
          chartsjs['memory']['load'] = new Chart(charts['memory']['load'], {
            type: 'line',
            data: {
              labels: [],
              datasets: [
                {
                  label: 'memory usage',
                  data: [],
                  fill: false,
                  borderColor: chartColors['cpu']['load'],
                  backgroundColor: chartColors['cpu']['load'],
                  tension: 0.2
                }
              ]
            },
            options: {
              aspectRatio: 5
            }
          })
        }
        if (memoryDataField['subType'] === 'free') {
          chartsjs['memory'][subType].data.datasets[0].data[0] = parseInt(memoryDataField['value'] / 1024);
        } else if (memoryDataField['subType'] === 'used') {
          chartsjs['memory'][subType].data.datasets[0].data[1] = parseInt(memoryDataField['value'] / 1024);

          //line chart
          if (chartsjs['memory']['load'].data.labels.length + 1 > 10) {
            removeData(chartsjs['memory']['load']);
          }
          if (addedUIDs['memory'][memoryDataField["uid"]] == undefined) {
            addedUIDs['memory'][memoryDataField['uid']] = true;
            const label = memoryDataField["date"].split('T')[1].split('.')[0];
            addData(chartsjs['memory']['load'], label, parseInt(memoryDataField['value'] / 1024));
          }
        }
        chartsjs['memory'][subType].update();
      }
    }
  }
}