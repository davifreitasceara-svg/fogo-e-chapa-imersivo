const ffmpeg = require('ffmpeg-static');
const { exec } = require('child_process');
const path = require('path');

const videoPath = path.resolve('public', 'davi_vs_golias_scroll.mp4');
const outDir = path.resolve('public', 'davi_vs_golias_frames');
const framePattern = path.join(outDir, 'frame_%04d.jpg');

const cmd = `"${ffmpeg}" -i "${videoPath}" -vf fps=30 -q:v 2 "${framePattern}"`;

console.log('Extracting frames...');
exec(cmd, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log('Finished extracting frames.');
});
