//<--------- new file --------->
function new_file() {

    editor.value = markdown_default;
    push_preview(editor.value)
    textHighlights()
    //
    update_alert("new");
}

//<--------- save file to browser --------->

function save_file() {

  window.localStorage.setItem("markdown", markdownText);
  update_alert("save");
}

//<--------- upload markdown to browser --------->

function read_file() {
  let file = upd_button.files[0];

  let reader = new FileReader();

  reader.readAsText(file);

  reader.onload = function() {
    update_alert("upd");
    savedCaret [0] = get_caret_position(editor).start;
    savedCaret [1] = get_caret_position(editor).end;

    navigator.clipboard.writeText(reader.result);
  };

  reader.onerror = function() {
    console.log(reader.error);
  };

}

//<--------- download markdown --------->
function download_markdown(){

  let text = markdownText;
  let filename = book_name + ".txt";

  download_text_file(filename, text);

  update_alert("dwn");
}

//<--------- table of contents --------->
function parse_toc(raw) {

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

function get_toc() {
    update_alert("toc");
    parse_toc (html);
    copy_to_clipboard(toc);
}

//<--------- scale preview --------->
function set_scale(value){
  scale = value / 100;
  preview.style.transform = "scale(" + scale + ")";
}


//<--------- split pane --------->
function init_drag(e) {
   startX = e.clientX;
   startWidth = parseInt(document.defaultView.getComputedStyle(left_pane).width, 10);
   document.documentElement.addEventListener('mousemove', doDrag, false);
   document.documentElement.addEventListener('mouseup', stopDrag, false);
}

function do_drag(e) {
   left_pane.style.width = (startWidth + e.clientX - startX) + 'px';
}

function stop_drag(e) {
  document.documentElement.removeEventListener('mousemove', doDrag, false);
  document.documentElement.removeEventListener('mouseup', stopDrag, false);
}


//<--------- alert messages --------->
function update_alert(value) {
  check_button(value);
  setTimeout(clear_messages, 5000)
}

// check button
function check_button(value) {
  switch (value) {
    case "new":
    new_message.innerHTML = "created!";
    return
    case "save":
    save_message.innerHTML = "saved!";
    return
    case "dwn":
      dwn_message.innerHTML = "saved!";
      return
    case "upd":
      upd_message.innerHTML = "ctrl + v to paste!";
      return
    case "toc":
      toc_message.innerHTML = "ctrl + v to paste!";
      return
  }
}
  // clear messages
function clear_messages() {
  new_message.innerHTML = "new file";
  save_message.innerHTML = "save";
  dwn_message.innerHTML = "download";
  upd_message.innerHTML = "upload";
  toc_message.innerHTML = "table of contents";
}