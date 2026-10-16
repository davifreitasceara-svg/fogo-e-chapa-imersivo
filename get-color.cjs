const fs = require("fs");
const jpeg = require("jpeg-js");
const jpgData = fs.readFileSync("public/davi_vs_golias_frames/frame_0001.jpg");
const raw = jpeg.decode(jpgData);
const hex =
  "#" +
  raw.data[0].toString(16).padStart(2, "0") +
  raw.data[1].toString(16).padStart(2, "0") +
  raw.data[2].toString(16).padStart(2, "0");
console.log("HEX: " + hex);
