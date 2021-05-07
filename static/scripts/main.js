//---------------- Variables ----------------
// html
const editor = document.getElementById('text-editor');
const preview = document.getElementById('preview');
const book = document.getElementById('book');
const stored_markdown = window.localStorage.getItem("markdown");
const left_pane = document.querySelector('.left-pane');
const split_pane = document.querySelector('.split-pane');
const scale_box = document.querySelector('.scale-box-text');
const editor_hightlights = document.querySelector('.editor-highlights');


const new_button = document.getElementById('new-button');
const save_button = document.getElementById('save-button');
const upd_button = document.getElementById('upd-button');
const dwn_button = document.getElementById('dwn-button');
const toc_button = document.getElementById('toc-button');
const prt_imp_button = document.getElementById('prt-imp-button');

const new_message = document.getElementById('new-message');
const save_message = document.getElementById('save-message');
const upd_message = document.getElementById('upd-message');
const toc_message = document.getElementById('toc-message');
const dwn_message = document.getElementById('dwn-message');
const prt_imp_message = document.getElementById('prt-imp-message');

// css
let css_main = load_file('static/css/main.css');
css_main.then(a => {
  css_main = a
});

let css_page = load_file('static/css/page.css');
css_page.then(a => {
  css_page = a
});

//pre-defined
let html;


// variables
let markdown_default = load_file('../../static/text/new.txt');
markdown_default.then(a => {markdown_default = a});
let xxx = markdown_default;

let book_name = "download";
let chapter_list = new Array;
let chapter_page = new Array;

//---------------- Essentials ----------------

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
function copy_to_clipboard(value) {
  navigator.clipboard.writeText(value);
}

// caret position
function get_caret_position(ctrl) {
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

function set_caret_position(ctrl, start, end) {
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

// <--------- load --------->
function load_file(path) {
  return fetch(path)
  .then((response) => response.text())
  .then((text) => {

    return text;

  })
  .catch(err => {console.log(err);});
}

// <--------- download --------->
function download_text_file(filename, text) {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

// <--------- clean DOM --------->
function clean(node)
{
  for(let n = 0; n < node.childNodes.length; n ++)
  {
    let child = node.childNodes[n];
    if
    (
      child.nodeType === 8 
      || 
      (child.nodeType === 3 && !/\S/.test(child.nodeValue))
    )
    {
      node.removeChild(child);
      n --;
    }
    else if(child.nodeType === 1)
    {
      clean(child);
    }
  }
}