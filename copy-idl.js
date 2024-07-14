const fs = require("fs");
const idl = require("./target/idl/anchor_escrow.json");

fs.writeFileSync("./frontend/idl.json", JSON.stringify(idl));
process.exit(0);
