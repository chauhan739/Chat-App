function openAlert(message) {
  console.log(message);
  
  const overlay = document.getElementById('customAlert');
  overlay.style.display = 'flex';

  const messageBox = document.getElementById('alertMessage');
  
  messageBox.innerHTML = message;
}

function closeAlert() {
  const overlay = document.getElementById('customAlert');
  overlay.style.display = 'none';
}