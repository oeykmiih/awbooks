//<--------- get css --------->
function getCSS(raw) {

  let css_raw;

  css_raw = raw.match(/<style>.*<\/style>/gis);
  if (!css_raw) {
    css_raw = "";
  }
  css_raw = String(css_raw).replace(/\<\/?style\>/gi, '');
  css_custom = css_raw;

  css = css_page + css_raw;

  return
}

function parse_pages(text) {
  let html = text
  .replace(/(\$[^\!])/gim, '$1\%pagebreak\%')
  .replace(/\/\/.*/gim, '')

  // get book name
  bookName = html.match(/\>\>"([^"]*)"/im);
  if (!bookName) {
    bookName = "";
  } else {
    bookName = bookName[1];
  }

  // indetify page breaks
  pages = html.split(/\%pagebreak\%/gim);

  // replace page breaks
  for (var i = 0; i < pages.length; i++) {

    pages[i] = pages[i].replace(/\$\!/gim, '</div></div><div class="sheet"><div class="page">')
    pages[i] = pages[i].replace(/\$/gim, '\n<div class="page-number">' + (i+1) + '</div><div class="book-name">' + bookName + '</div><div class="chapter-name">%chaptername%</div></div></div><div class="sheet"><div class="page">')
  }

  // join pages
  html = "";

  for (var i = 0; i < pages.length; i++) {
    html += pages[i];
  }

  return html
}

function parse_chapters(text) {

  let html = "";
  let html_split;
  chapter_list = ['']

  html_split = text.split(/(?=^\#\s?([^\#\n\>\:]+))/gim);

  for (let i = 1; i < Math.floor(html_split.length); i+=2) {
    html_split[i] = html_split[i].replace(/\\n/gm, '')
    chapter_list.push(html_split[i]);   
  }

  for (let i = 0; i <  Math.floor(html_split.length); i+=2) {
    
    chapter_page[i/2] = html_split[i].match(/(?:\<div class\="page-number"\>)[^\<]*?/gim)
    html_split[i] = html_split[i].replace(/\%chaptername\%/gim, chapter_list[i/2])

    html += html_split[i]
  }

  return html;
  
}

//<--------- parse markdown --------->
function parse_markdown(text) {  

    html = text;

    // get book name
    book_name = (!html.match(/\>\>"([^"]*)"/im)) ? 'download' : html.match(/\>\>"([^"]*)"/im)[1];

    html = html
      .replace(/\>\>"([^"]*)"/im, '<title>$1</title>')  
      .replace()

      .replace(/^\#\>\s?"([^"]*)"/gim, '<div class="header" style="">$1</div>')
      .replace(/\\n/gim, '<br>')
      .replace(/^\^/gm, '<p></p>')

      .replace(/^\#\s?([^\#\n]+)/gim, '<h1>$1</h1>')
      .replace(/^\#\#\s?([^\#\n]+)/gim, '<h2>$1</h2>')
      .replace(/^\#\#\#\s?([^\#\n]+)/gim, '<h3>$1</h3>')
      // .replace(/^\#\#\#\#\s?([^\#\n]+)/gim, '<h4>$1</h4>')
      // .replace(/^\#\#\#\#\#\s?([^\#\n]+)/gim, '<h5>$1</h5>')
      .replace(/^\>\s?([^\#\n]+)/gim, '<blockquote>$1</blockquote>')
      .replace(/^([^\#\n\<\\\>\%]+)/gim, '<p>$1</p>')
      .replace(/(\n{2}\n+)/gim, '<div class="paragraph-break"></div>')

    return html;
}

//<--------- render book --------->
function render_preview(html) {
  return `<div class="sheet">
              <div class="page toc">
                 ${html}
              </div>
            </div>
            `
}

//<--------- print --------->

function impose_print() {
  let imposed_signatures = Math.ceil(book.children.length/16);
  let source_pages = book.children;
  let source_number_pages = source_pages.length;

  let html_dump = document.createElement('div');
  html_dump.id = 'html_dump';
  html_dump.setAttribute('class', 'html-dump');

  for (let i = 0; i < source_number_pages; i++) {
    let current_sheet = source_pages[0];

    
    // console.log(current_sheet.children[0]);
    html_dump.appendChild(current_sheet)
  }

  while (html_dump.children.length < (imposed_signatures * 16)) {
    let fill_sheet = document.createElement('div');
    fill_sheet.setAttribute('class', 'sheet')
    fill_sheet.innerHTML = '<div page></div>'

    html_dump.appendChild(fill_sheet)
  }

  for (let i = 0; i < imposed_signatures; i++) {
    let signature = i*16

    let imposed_pages = new Array;
    let cloned_pages = new Array;

    // console.log(html_dump.children[signature+0].children[0]);
    // console.log(html_dump.children[signature+15].children[0]);

    imposed_pages[0] = html_dump.children[signature+15].children[0];
    imposed_pages[1] = html_dump.children[signature+0].children[0];
    imposed_pages[2] = html_dump.children[signature+1].children[0];
    imposed_pages[3] = html_dump.children[signature+14].children[0];

    imposed_pages[4] = html_dump.children[signature+13].children[0];
    imposed_pages[5] = html_dump.children[signature+2].children[0];
    imposed_pages[6] = html_dump.children[signature+3].children[0];
    imposed_pages[7] = html_dump.children[signature+12].children[0];

    imposed_pages[8] = html_dump.children[signature+11].children[0];
    imposed_pages[9] = html_dump.children[signature+4].children[0];
    imposed_pages[10] = html_dump.children[signature+5].children[0];
    imposed_pages[11] = html_dump.children[signature+10].children[0];

    imposed_pages[12] = html_dump.children[signature+9].children[0];
    imposed_pages[13] = html_dump.children[signature+6].children[0];
    imposed_pages[14] = html_dump.children[signature+7].children[0];
    imposed_pages[15] = html_dump.children[signature+8].children[0];

    for (let i = 0; i < 16; i+=2) {
      let new_sheet = document.createElement('div');
      new_sheet.setAttribute('class', 'sheet');

      cloned_pages[0] = imposed_pages[i].cloneNode(true);
      new_sheet.appendChild(cloned_pages[0]);

      cloned_pages[1] = imposed_pages[i+1].cloneNode(true);
      new_sheet.appendChild(cloned_pages[1]);

      cloned_pages = []

      book.appendChild(new_sheet);           
    }
  }
}

function add_bleed_marks() {
  let book_print = document.getElementById('book');

  for (let i = 0; i < book_print.children.length; i++) {
    let bleed_top_right = document.createElement('div')
    bleed_top_right.setAttribute('class', 'bleed-top-right')
  
    let bleed_bot_right = document.createElement('div')
    bleed_bot_right.setAttribute('class', 'bleed-bot-right')
  
    let bleed_top_left = document.createElement('div')
    bleed_top_left.setAttribute('class', 'bleed-top-left')
  
    let bleed_bot_left = document.createElement('div')
    bleed_bot_left.setAttribute('class', 'bleed-bot-left')

    let bleed_top_middle = document.createElement('div')
    bleed_top_middle.setAttribute('class', 'bleed-top-middle')

    let bleed_bot_middle = document.createElement('div')
    bleed_bot_middle.setAttribute('class', 'bleed-bot-middle')
  
    book_print.children[i].appendChild(bleed_top_right);
    book_print.children[i].appendChild(bleed_top_left);
    book_print.children[i].appendChild(bleed_bot_right);
    book_print.children[i].appendChild(bleed_bot_left);
    book_print.children[i].appendChild(bleed_top_middle);
    book_print.children[i].appendChild(bleed_bot_middle);
    
    
  }
}

function print_pages() {
  impose_print();
  add_bleed_marks();

  window.print()

  return
}

//<--------- push preview (main calling function) --------->
function push_preview(raw) {

  html = raw;

  html = parse_pages(html);
  html = parse_chapters(html);
  html = parse_markdown(html);
  html = render_preview(html);

  //update markdownText value
  markdownText = raw;
  editor_hightlights.textContent = raw;
  //update preview
  book.innerHTML = html;
}

function parse_on_load() {

  if (stored_markdown) {
    editor.value = stored_markdown;
    push_preview(stored_markdown);
  } else if (!editor.textContent) {
  }  else {
    push_preview(editor.textContent);
  }
}


