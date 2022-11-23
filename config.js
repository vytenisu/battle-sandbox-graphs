const { resolve } = require("path");

module.exports = {
  SOURCES: {
    ["Accuracy"]: {
      path: resolve(
        __dirname,
        "../battle-sandbox-ai-trainer/models/main/acc.log"
      ),
      color: "#aa0000",
    },
    ["Validation Accuracy"]: {
      path: resolve(
        __dirname,
        "../battle-sandbox-ai-trainer/models/main/val_acc.log"
      ),
      color: "#00aa00",
    },
    ["Loss"]: {
      path: resolve(
        __dirname,
        "../battle-sandbox-ai-trainer/models/main/loss.log"
      ),
      color: "#0000aa",
    },
    ["Validation Loss"]: {
      path: resolve(
        __dirname,
        "../battle-sandbox-ai-trainer/models/main/val_loss.log"
      ),
      color: "#00aaaa",
    },
  },
};
