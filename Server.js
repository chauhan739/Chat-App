const express = require("express");
const http = require("http");
const router = require("./routes/Router.js");
const session = require("express-session");
const { initializeSocket } = require("./utils/SocketManager.js");
const path = require("path")
const Port = process.env.PORT || 8080;
const HOST = '0.0.0.0';
const app = express();

const server = http.createServer(app);

initializeSocket(server);

app.use(express.static(path.join(__dirname, "/views")));
app.use(express.static(path.join(__dirname, "/public")));

// app.use(express.static(__dirname + "/views"));
// app.use(express.static(__dirname + "/public"));

app.use(
    session({
        secret: "aryan-secret-key",
        resave: false,
        saveUninitialized: false,
    })
);

app.use(express.json());
app.use(router);

server.listen(Port, HOST, function () {
    console.log("Server is listening on port", Port);
});
