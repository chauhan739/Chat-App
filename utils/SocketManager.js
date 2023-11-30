const socketIo = require("socket.io");
const client = require("../data_access/DbConnection.js");

const users = new Map();

function initializeSocket(server) {
    const io = socketIo(server);

    io.on("connection", (socket) => {
        socket.on("username", (uname) => {
            users.set(socket.id, uname);
            io.emit("total users", Array.from(users.values()));
        });

        socket.on("chat message", (msg) => {
            const senderSocketId = getByValue(users, msg.sender);
            const receiverSocketId = getByValue(users, msg.receiver);
            io.to(senderSocketId).emit("chat message", msg);
            io.to(receiverSocketId).emit("chat message", msg);
        });

        socket.on("commented", async (msg) => {
            const result = await client.query(
                "SELECT users.username FROM posts JOIN users ON posts.email = users.email WHERE posts.postid = $1",
                [msg.postid]
            );
            io.to(getByValue(users, result.rows[0].username)).emit(
                "comment",
                msg.username
            );
            io.emit("latest comment", msg.latestComment);
        });

        socket.on("disconnecting", () => {
            users.delete(socket.id);
            io.emit("total users", Array.from(users.values()));
        });
    });
}

function getByValue(map, username) {
    for (let [socketId, uname] of map.entries()) {
        if (uname === username) return socketId;
    }
}

module.exports = {
    initializeSocket,
};
