//---------------- Fire Functions, Event Listener ----------------

parseTOC (html) // summon on load

setScale(scale); // summon on load

newButton.addEventListener('click', newFile, false);
saveButton.addEventListener('click', saveFile, false);
updButton.addEventListener('change', readFile);
dwnButton.addEventListener('click', downloadMarkdown , false);
tocButton.addEventListener('click', getTOC, false);
splitPane.addEventListener('mousedown', initDrag, false);
scaleBox.addEventListener('keyup', evt => {
  const {
    value
  } = evt.target;
  setScale(value);
})

//---------------- Tools ----------------


//<--------- new file --------->
function newFile() {

    // textEditor.value = markdownDefault;
    console.log("hey");
    pushPreview(textEditor.value)
    //
    updateAlert("new");
}

//<--------- save file to browser --------->

function saveFile() {

  window.localStorage.setItem("markdown", markdownText);
  updateAlert("save");
}

//<--------- upload markdown to browser --------->

function readFile() {
  let file = updButton.files[0];

  let reader = new FileReader();

  reader.readAsText(file);

  reader.onload = function() {
    updateAlert("upd");
    savedCaret [0] = getCaretPosition(textEditor).start;
    savedCaret [1] = getCaretPosition(textEditor).end;

    navigator.clipboard.writeText(reader.result);

  };

  reader.onerror = function() {
    console.log(reader.error);
  };

}

//<--------- download markdown --------->
function downloadMarkdown(){

  let text = markdownText;
  let filename = bookName + ".txt";

  downloadasTextFile(filename, text);

  updateAlert("dwn");
}

//<--------- table of contents --------->
function parseTOC(raw) {

  toc = "";

let headings = raw.replace(/\<br\>/gim, '\\n')
                  .split(/\<h1\>/gim)
let chapterPage = new Array;

for (var i = 1; i < headings.length; i++) {
  let match
  let match2

  match = headings[i].match(/(?:<div class="page-number">)(\d+)/i);
  chapterPage[i] = match[1];

  match2 = headings[i].match(/(.*?)<\/h1>/i);
  headings[i] = match2[1];
}

for (var i = 1; i < headings.length; i++) {
  toc += '## ' + chapterPage[i] + '. ' + headings[i] + '\n\n'
}
    return toc
}

function getTOC() {
    updateAlert("toc");
    parseTOC (html);
    copyToClipboard(toc);
}

//<--------- scale preview --------->
function setScale(value){
  scale = value / 100;
  preview.style.transform = "scale(" + scale + ")";
}


//<--------- split pane --------->
function initDrag(e) {



   startX = e.clientX;
   startWidth = parseInt(document.defaultView.getComputedStyle(leftPane).width, 10);
   document.documentElement.addEventListener('mousemove', doDrag, false);
   document.documentElement.addEventListener('mouseup', stopDrag, false);
}

function doDrag(e) {
   leftPane.style.width = (startWidth + e.clientX - startX) + 'px';
}

function stopDrag(e) {
  document.documentElement.removeEventListener('mousemove', doDrag, false);
  document.documentElement.removeEventListener('mouseup', stopDrag, false);
}


//<--------- alert messages --------->
function updateAlert(value) {
  checkButton(value);
  setTimeout(clearMessages, 5000)
}

// check button
function checkButton(value) {
  switch (value) {
    case "new":
    newMessage.innerHTML = "created!";
    return
    case "save":
    saveMessage.innerHTML = "saved!";
    return
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
  // clear messages
function clearMessages() {
  newMessage.innerHTML = "new file";
  saveMessage.innerHTML = "save";
  dwnMessage.innerHTML = "download";
  updMessage.innerHTML = "upload";
  tocMessage.innerHTML = "table of contents";

}
