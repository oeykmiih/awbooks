//---------------- Variables ----------------
// html
const textEditor = document.getElementById('text-editor');
const preview = document.getElementById('preview');
const storedMarkdown = window.localStorage.getItem("markdown");
const leftPane = document.querySelector('.left-pane');
const splitPane = document.querySelector('.split-pane');
const scaleBox = document.querySelector('.scale-box-text');
const editorHighlights = document.querySelector('.editor-highlights');


const newButton = document.getElementById('new-button');
const saveButton = document.getElementById('save-button');
const updButton = document.getElementById('upd-button');
const dwnButton = document.getElementById('dwn-button');
const tocButton = document.getElementById('toc-button');
const dbgpButton = document.getElementById('dbgp-button');
const dbgIbButton = document.getElementById('dbgIb-button');
const dbgCButton = document.getElementById('dbgC-button');

const newMessage = document.getElementById('new-message');
const saveMessage = document.getElementById('save-message');
const updMessage = document.getElementById('upd-message');
const dwnMessage = document.getElementById('dwn-message');
const tocMessage = document.getElementById('toc-message');
const dbgpMessage = document.getElementById('dbgp-message');
const dbgIbMessage = document.getElementById('dbgIb-message');
const dbgCMessage = document.getElementById('dbgC-message');

// css
let cssMain = loadFile('static/css/main.css');
cssMain.then(a => {
  cssMain = a
});

let cssPage = loadFile('static/css/page.css');
cssPage.then(a => {
  cssPage = a
}).then(a => {
  css = cssPage
});

//pre-defined


// variables
let markdown = textEditor.textContent;
let cssCustom = document.getElementById('css-custom').textContent;
let scale = scaleBox.textContent;

let markdownDefault = loadFile('../../static/text/new.txt');
markdownDefault.then(a => {markdownDefault = a});

let css;
let bookName;
let pages;
let chapters;
let chaptersPush = new Array;

let toc = "";
let savedCaret = [];
let startX , startWidth;

let debugMarginOn = "false";
let debugImageOn = "false";
let debugCaret = "false";

let textEditorContent;

//---------------- Essentials ----------------

// load file
function loadFile(path) {
  return fetch(path)
  .then((response) => response.text())
  .then((text) => {

    return text;

  })
  .catch(err => {console.log(err);});
}

// debounce feature -> updates every x seconds
let debounce = (func, delay) => {
  let Timer
  return function() {
  const context = this
  const args = arguments
  clearTimeout(Timer)
  Timer
  = setTimeout(() =>
  func.apply(context, args), delay)
  }
}

// copy to clipboard
function copyToClipboard(value) {
  savedCaret [0] = getCaretPosition(textEditor).start;
  savedCaret [1] = getCaretPosition(textEditor).end;
  navigator.clipboard.writeText(value);
}

// caret position
function getCaretPosition(ctrl) {
    // IE < 9 Support
    if (document.selection) {
        ctrl.focus();
        var range = document.selection.createRange();
        var rangelen = range.text.length;
        range.moveStart('character', -ctrl.value.length);
        var start = range.text.length - rangelen;
        return {
            'start': start,
            'end': start + rangelen
        };
    } // IE >=9 and other browsers
    else if (ctrl.selectionStart || ctrl.selectionStart == '0') {
        return {
            'start': ctrl.selectionStart,
            'end': ctrl.selectionEnd
        };
    } else {
        return {
            'start': 0,
            'end': 0
        };
    }
}

function setCaretPosition(ctrl, start, end) {
    // IE >= 9 and other browsers
    if (ctrl.setSelectionRange) {
        ctrl.focus();
        ctrl.setSelectionRange(start, end);
    }
    // IE < 9
    else if (ctrl.createTextRange) {
        var range = ctrl.createTextRange();
        range.collapse(true);
        range.moveEnd('character', end);
        range.moveStart('character', start);
        range.select();
    }
}

//<--------- download --------->
function downloadasTextFile(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
