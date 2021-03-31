//---------------- Fire Functions, Event Listener ----------------

initParseOnLoad() // summon on load

parseTOC (html) // summon on load

setScale(scale); // summon on load

textHighlights(); // summon on load

textEditor.addEventListener('keyup',
  debounce(evt => {const { value } = evt.target;pushPreview(value);textHighlights();}, 250));
textEditor.addEventListener('scroll', handleScroll, false);

newButton.addEventListener('click', newFile, false);
saveButton.addEventListener('click', saveFile, false);
updButton.addEventListener('change', readFile);
dwnButton.addEventListener('click', downloadMarkdown , false);
tocButton.addEventListener('click', getTOC, false);
dbgpButton.addEventListener('click', debugPageMargin, false);
dbgIbButton.addEventListener('click', debugImageBorder, false);
dbgCButton.addEventListener('click', debugCaretDisplay, false);
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

    textEditor.value = markdownDefault;
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
  if (match == null) {
    chapterPage[i] = '?';
  } else {
    chapterPage[i]=match[1] - 1;
  }

  match2 = headings[i].match(/(.*?)<\/h1>/i);
  headings[i] = match2[1];
}

for (var i = 1; i < headings.length; i++) {
  toc += '## ' + chapterPage[i] + '. ' + headings[i] + '\n\n'
}

toc = toc.slice(0, -2);
    return toc
}

function getTOC() {
    updateAlert("toc");
    parseTOC (html);
    copyToClipboard(toc);
}

//<--------- debug page margin --------->
function debugPageMargin() {
  if (debugMarginOn == "false") {
  document.documentElement.style.setProperty("--debugPageMargin", "block");
  debugMarginOn = "true";
  updateAlert("dbgpOn");
  } else {
  document.documentElement.style.setProperty("--debugPageMargin", "none");
  debugMarginOn = "false";
  updateAlert("dbgpOff");
}
}

//<--------- debug gallery image border --------->
function debugImageBorder() {
  if (debugImageOn == "false") {
  document.documentElement.style.setProperty("--debugImageBorder", "block");
  debugImageOn = "true";
  updateAlert("dbgIbOn");
  } else {
  document.documentElement.style.setProperty("--debugImageBorder", "none");
  debugImageOn = "false";
  updateAlert("dbgIbOff");
}
}

//<--------- debug caret display --------->
function debugCaretDisplay() {
  if (debugCaret == "false") {
    debugCaret = "true";
    updateAlert("dbgCOn");
    } else {
    debugCaret = "false";
    updateAlert("dbgCOff");
    }
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
    case "dbgpOn":
      dbgpMessage.innerHTML = "page margins on";
      return
    case "dbgpOff":
      dbgpMessage.innerHTML = "page margins off";
      return
    case "dbgIbOn":
      dbgIbMessage.innerHTML = "image borders on";
      return
    case "dbgIbOff":
      dbgIbMessage.innerHTML = "image borders off";
      return
    case "dbgCOn":
      dbgCMessage.innerHTML = "caret display on";
      return
    case "dbgCOff":
      dbgCMessage.innerHTML = "caret display off";
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
