const socket = io();

document.getElementById('form').addEventListener('submit', function (e) {
  e.preventDefault();
  const sender = document.getElementById('sender').value;
  const msg = document.getElementById('input').value;

  socket.emit('chatMessage', { sender, content: msg });
  document.getElementById('input').value = '';
});

socket.on('chatMessage', function (msg) {
  const li = document.createElement('li');
  li.innerHTML = `<b>${msg.sender}:</b> ${msg.content}`;
  document.getElementById('messages').appendChild(li);
});
