const sources = require("./config").SOURCES;
const { readFileSync, writeFileSync } = require("fs");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const ChromeLauncher = require("chrome-launcher");
const { resolve } = require("path");

Object.entries(sources).forEach(([key, { path }]) => {
  const rawData = readFileSync(path, "utf8");
  const data = rawData.split("\n").map((row) => row.split(" --- ")[1]);
  sources[key].data = data
    .filter(Boolean)
    .map((value, index) => ({ x: index + 1, y: value }));
});

const data = {
  datasets: Object.entries(sources).map(([label, { data, color }]) => ({
    label,
    data,
    backgroundColor: color,
    borderColor: color,
  })),
};

const renderer = new ChartJSNodeCanvas({ width: 800, height: 800 });
const graph = renderer.renderToDataURLSync({
  data,
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
  <img src="${graph}" style="width: 800px; height: 800px;" />
</body></html>
`;

const graphFile = resolve(__dirname, "graph.html");

writeFileSync(graphFile, wrappedGraph, "utf-8");

ChromeLauncher.launch({
  startingUrl: "file://" + resolve(__dirname, "graph.html"),
});
