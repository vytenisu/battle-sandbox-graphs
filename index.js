const { readFileSync, writeFileSync } = require("fs");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const ChromeLauncher = require("chrome-launcher");
const { resolve } = require("path");

const updateData = () => {
  const sources = JSON.parse(JSON.stringify(require("./config").SOURCES));

  Object.entries(sources).forEach(([key, { path }]) => {
    const rawData = readFileSync(path, "utf8");
    const data = rawData.split("\n").map((row) => row.split(" --- ")[1]);
    sources[key].data = data
      .filter(Boolean)
      .map((value, index) => ({ x: index + 1, y: value }));
  });

  const data1 = {
    datasets: Object.entries(sources)
      .map(([label, { data, color, graph }]) =>
        graph === 1
          ? {
              label,
              data,
              backgroundColor: color,
              borderColor: color,
            }
          : null
      )
      .filter(Boolean),
  };

  const data2 = {
    datasets: Object.entries(sources)
      .map(([label, { data, color, graph }]) =>
        graph === 2
          ? {
              label,
              data,
              backgroundColor: color,
              borderColor: color,
            }
          : null
      )
      .filter(Boolean),
  };

  const renderer = new ChartJSNodeCanvas({ width: 1800, height: 400 });

  const graph1 = renderer.renderToDataURLSync({
    data: data1,
    type: "line",
    options: {
      scales: {
        x: {
          type: "linear",
          position: "bottom",
        },
        y: {
          type: "linear",
          position: "left",
        },
      },
    },
  });

  const graph2 = renderer.renderToDataURLSync({
    data: data2,
    type: "line",
    options: {
      scales: {
        x: {
          type: "linear",
          position: "bottom",
        },
        y: {
          type: "linear",
          position: "left",
        },
      },
    },
  });

  const wrappedGraph = `
  <!DOCTYPE html><html><head><title>Graph</title></head><body>
    <img src="${graph1}" style="width: 1800px; height: 400px;" />
    <img src="${graph2}" style="width: 1800px; height: 400px;" />
    <script>setInterval(() => window.location.href = window.location.href, 10000)</script>
  </body></html>
  `;

  const graphFile = resolve(__dirname, "graph.html");

  writeFileSync(graphFile, wrappedGraph, "utf-8");
};

updateData();

ChromeLauncher.launch({
  startingUrl: "file://" + resolve(__dirname, "graph.html"),
});

setInterval(updateData, 10000);
