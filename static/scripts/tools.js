// Variables
let toc = "";
let savedCaret = [];


// Caret position
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

// Clipboard
function copyToClipboard(value) {
  savedCaret [0] = getCaretPosition(textEditor).start;
  savedCaret [1] = getCaretPosition(textEditor).end;
  navigator.clipboard.writeText(value);
}

function pastInPlace() {
  setCaretPosition(textEditor, savedCaret [0], savedCaret [1])
}

// TOC

function generateTOC(raw) {

  toc = "";

  let headings = raw

    .match(/^#\s(.*?)$/gim)


    for (var i = 0; i < headings.length; i++) {
      toc = toc + "#" + headings[i] + "\r\r";
    }

    toc = toc.trim()
    toc = toc + "\n";

    return
}


document.getElementById("toc-button").addEventListener("click", function() {
  generateTOC (markdownText);
  copyToClipboard(toc);
  pastInPlace();
});

generateTOC (markdownText)
