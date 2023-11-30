let zIndexCounter = 1;

function openChat() {
  const chatPopup = document.createElement('div');
  chatPopup.classList.add('chat-popup');
  chatPopup.style.zIndex = zIndexCounter++;

  const header = document.createElement('div');
  header.classList.add('chat-popup-header');
  header.innerHTML = '<span style="cursor: pointer;" onclick="closeChat(this)">X</span> Chat Window';
  header.onmousedown = function (e) {
    dragElement(chatPopup, e);
  };

  const body = document.createElement('div');
  body.classList.add('chat-popup-body');
  body.id = "messages";
  body.innerHTML = '<p>This is the chat content. You can add your chat messages here.</p>';
  body.style.maxHeight = 'calc(300px - 40px)'; // Subtracting the header height

  const send_message_area = document.createElement('div');
  send_message_area.classList.add('send_message_area');

  const input_area = document.createElement('input');
  input_area.classList.add('chat-popup-input');
  input_area.id = "input-message";
  input_area.placeholder = 'Type your message...';
  input_area.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      sendMessage(input_area.value);
    }
  });

  const button = document.createElement('div');
  button.classList.add('chat-popup-button');
  button.innerHTML = `<button type="button" onclick="sendmessage()">Send</button>`
  // button.addEventListener('click', function () {
  //   sendMessage(input_area.value);
  // });

  send_message_area.appendChild(input_area);
  send_message_area.appendChild(button);



  // body.appendChild(input_area);
  // body.appendChild(button);
  body.appendChild(send_message_area);
  chatPopup.appendChild(header);
  chatPopup.appendChild(body);
  document.body.appendChild(chatPopup);
}

function closeChat(element) {
  const chatPopup = element.closest('.chat-popup');
  if (chatPopup) {
    chatPopup.remove();
  }
}

function dragElement(elmnt, e) {
  e = e || window.event;
  e.preventDefault();
  let pos1 = e.clientX;
  let pos2 = e.clientY;
  let pos3 = 0;
  let pos4 = 0;
  document.onmouseup = closeDragElement;
  document.onmousemove = elementDrag;

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = pos1 - e.clientX;
    pos4 = pos2 - e.clientY;
    pos1 = e.clientX;
    pos2 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos4) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos3) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function sendMessage(message) {
  const chatPopup = document.querySelector('.chat-popup');
  const body = chatPopup.querySelector('.chat-popup-body');
  const messageContainer = document.createElement('div');
  messageContainer.innerText = message;
  body.appendChild(messageContainer);
}