const { spawn } = require("child_process");
const fs = require("fs");

function runProcess(command, args, input) {
  return new Promise((resolve, reject) => {

    const proc = spawn(command, args, { shell: true });

    let output = "";
    let errorOutput = "";

    const timer = setTimeout(() => {
      proc.kill();
      reject("Time Limit Exceeded");
    }, 5000);

    if (input) {
      proc.stdin.write(input);
    }
    proc.stdin.end();

    proc.stdout.on("data", (data) => {
      output += data.toString();
    });

    proc.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    proc.on("close", (code) => {
      clearTimeout(timer);
      if (code !== 0 && errorOutput) return reject(errorOutput);
      resolve(output);
    });

    proc.on("error", (err) => {
      clearTimeout(timer);
      reject(err.message);
    });
  });
}

exports.executeCode = async (language, code, input) => {

  switch (language) {

    case "python":
      fs.writeFileSync("main.py", code);
      return await runProcess("py", ["main.py"], input);

    case "javascript":
      fs.writeFileSync("main.js", code);
      return await runProcess("node", ["main.js"], input);

    case "cpp":
      fs.writeFileSync("main.cpp", code);
      await runProcess("g++", ["main.cpp", "-o", "main.exe"]);
      return await runProcess("main.exe", [], input);

    case "c":
      fs.writeFileSync("main.c", code);
      await runProcess("gcc", ["main.c", "-o", "main.exe"]);
      return await runProcess("main.exe", [], input);

    case "java":
      fs.writeFileSync("Main.java", code);
      await runProcess("javac", ["Main.java"]);
      return await runProcess("java", ["Main"], input);

    default:
      throw "Unsupported language";
  }
};
