let dwnMessage = document.getElementById('dwn-message');
let updMessage = document.getElementById('upd-message');
let tocMessage = document.getElementById('toc-message');


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
  }
}

function clearMessages() {
  dwnMessage.innerHTML = "download";
  updMessage.innerHTML = "upload";
  tocMessage.innerHTML = "table of contents";
}
