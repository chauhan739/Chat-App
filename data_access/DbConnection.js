const { Pool } = require("pg");

const client = new Pool({
    user: "postgres",
    host: "localhost",
    database: "Node-Application",
    password: "Chauhan@739",
    port: 5432,
});

console.log("DB connected");

module.exports = client;
