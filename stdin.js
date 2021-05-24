// node muhammad.js < myTestFile.txt
const fs = require("fs");
const data = fs.readFileSync(process.stdin.fd, "utf-8");
console.log("theDataIs", typeof data);
console.log(data.split("\n"));
