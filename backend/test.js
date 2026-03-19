const { exec } = require("child_process");

exec("python --version", (err, stdout, stderr) => {
  console.log("OUT:", stdout);
  console.log("ERR:", stderr);
});
