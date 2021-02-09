let dwnMessage = document.getElementById('dwn-message');
let updMessage = document.getElementById('upd-message');
let tocMessage = document.getElementById('toc-message');
let newMessage = document.getElementById('new-message');
let saveMessage = document.getElementById('save-message');


function updateAlert(value) {
  checkButton(value);
  setTimeout(clearMessages, 5000)
}

function checkButton(value) {
  switch (value) {
    case "dwn":
      dwnMessage.innerHTML = "saved!";
      return
    case "upd":
      updMessage.innerHTML = "ctrl + v to paste!";
      return
    case "toc":
      tocMessage.innerHTML = "ctrl + v to paste!";
      return
    case "new":
      newMessage.innerHTML = "created!";
      return
    case "save":
      saveMessage.innerHTML = "saved!";
      return
  }
}

function clearMessages() {
  dwnMessage.innerHTML = "download";
  updMessage.innerHTML = "upload";
  tocMessage.innerHTML = "table of contents";
  newMessage.innerHTML = "new file";
  saveMessage.innerHTML = "save";

}
