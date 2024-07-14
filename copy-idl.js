const fs = require("fs");
const idl = require("./target/idl/anchor_escrow.json");

fs.writeFileSync("./frontend/data/idl.json", JSON.stringify(idl));
process.exit(0);
