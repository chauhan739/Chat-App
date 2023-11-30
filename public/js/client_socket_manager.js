const socket = io();

const input = document.getElementById("input-message");
const messages = document.getElementById("messages");
const onlineUserList = document.getElementById("online-users");

const uname = localStorage.username;
const time = Date().split(" ")[4];

socket.on("connect", () => {
    socket.emit("username", `${uname}`);
});

function sendmessage() {
    const message = {
        mess: input.value,
        sender: uname,
        senderMail: localStorage.email,
        receiver: receiver,
        time: time,
    };

    if (input.value) {
        // socket.emit("chat message", `${input.value} - ${uname} ${time}`);
        socket.emit("chat message", message);
        input.value = "";
    }
    socket.emit("total users");
}

socket.on("total users", (users) => {
    onlineUserList.innerHTML = "";
    console.log(users);
    users.sort();
    users.forEach((user) => {
        const button = document.createElement("button");
        button.setAttribute("type", "button");
        button.setAttribute("class", "user");
        button.setAttribute("name", "user");
        button.setAttribute("value", `${user}`);
        button.setAttribute("onclick", `chatting("${user}")`);
        button.innerText = user;
        onlineUserList.appendChild(button);
    });
});

const chatMap = new Map();
socket.on("chat message", function (msg) {
    const outer_div = document.createElement("div");
    const inner_div = document.createElement("div");
    if (localStorage.username == msg.sender)
        inner_div.classList.add("sender-message");
    else inner_div.classList.add("receiver-message");
    console.log(msg);
    inner_div.textContent = msg.mess;
    outer_div.appendChild(inner_div)
    messages.appendChild(outer_div);
});

socket.on("comment", (msg) => {
    console.log("Comment Socket - Client");
    alert(msg + " commented on your post");
});

socket.on("latest comment", (msg) => {
    const commentsAreaId = "comments-area-" + msg.postid;
    const commentsContainer = document.getElementById(commentsAreaId);
    const comment = document.createElement("div");
    comment.innerHTML = `
        ${msg.comment} - <h4 style="display:inline;">${msg.comment_from}</h4>
    `;
    comment.style.marginLeft = "8px";
    comment.style.marginBottom = "8px";
    comment.style.fontSize = "12px";
    commentsContainer.appendChild(comment);
});

socket.on("disconnect", () => {
    socket.emit("disconnecting");
});
