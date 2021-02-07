// Variables
let toc = "";
let savedCaret = [];
let scaleInitialValue = document.querySelector('.scale-box-text').textContent;

// Get HTML
const scaleBoxText = document.querySelector('.scale-box-text')

// !core functionality

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

// clipboard
function copyToClipboard(value) {
  savedCaret [0] = getCaretPosition(textEditor).start;
  savedCaret [1] = getCaretPosition(textEditor).end;
  navigator.clipboard.writeText(value);
}

function pastInPlace() {
  setCaretPosition(textEditor, savedCaret [0], savedCaret [1])
}

// download
function downloadasTextFile(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

  // start file download.
  document.getElementById("dwn-button").addEventListener("click", function(){

    let text = markdownText;
    let filename = bookName[1] + ".txt";


    downloadasTextFile(filename, text);

    updateAlert("dwn");
}, false);

// upload

let updfile = document.getElementById("upd-button")
updfile.addEventListener("change", readFile);

function readFile(e) {
  let file = updfile.files[0];

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




// !snippets

// toc
function generateTOC(raw) {

  toc = "";

  let headings = raw

    .match(/^#\s(.*?)$/gim)

    if (!headings.length) {
      return
    }

    for (var i = 0; i < headings.length; i++) {
      toc = toc + "#" + headings[i] + "\r\r";
    }

    toc = toc.trim()
    toc = toc + "\n";

    return
}


document.getElementById("toc-button").addEventListener("click", function() {
  updateAlert("toc");
  generateTOC (markdownText);
  copyToClipboard(toc);
  pastInPlace();
});


generateTOC (markdownText)
// summon on load

// scale box
function setScale(value){
  scaleValue = value / 100;
  console.log(scaleValue);
  preview.style.transform = "scale(" + scaleValue + ")";
}

scaleBoxText.addEventListener('keyup', evt => {
  const {
    value
  } = evt.target;
  setScale(value);
})

setScale(scaleInitialValue);
// summon on load
