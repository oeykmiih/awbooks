
//<--------- get css --------->
function getCSS(raw) {

  let cssRaw = "";

  cssRaw = raw.match(/<style>.*<\/style>/gis);
  if (!cssRaw) {
    cssRaw = "";
  }
  cssRaw = String(cssRaw).replace(/\<\/?style\>/gi, '');
  cssCustom = cssRaw;

  css = cssPage + cssRaw;

  return
}

//<--------- editor-highlights --------->

function applyHighlights(text) {
  return text
  // \n is causing missplacement on the highilghts, this is a temporary fix
    .replace(/\\n/gim, 'XX')

    .replace(/\$!/gim, '<highlight1>X!</highlight1>')
    .replace(/\$/gim, '<highlight1>X</highlight1>')
    .replace(/^\^/gim, '<highlight2>X</highlight2>')
    .replace(/^(\#\s.*)/gim, '<highlight3>$1</highlight3>');
}

function textHighlights() {
  editorHighlights.innerHTML = applyHighlights(editorHighlights.textContent);
  handleScroll();
}

function handleScroll() {
  let scroll = textEditor.scrollTop;
  editorHighlights.scrollTop = scroll;
}

//<--------- caret-position --------->

function visibleCaret(value) {

    if (debugCaret == "false") {
      return value;
    }

  // get caret position
    let caret = getCaretPosition(textEditor).start;

  // add caret marker at caret position
    let y =  value.slice(0 ,caret) + "<!" + value.slice(caret) ;

    return y;
}


//<--------- parse markdown --------->
function parseMarkdown(raw) {

  getCSS(raw);

  // get rid of css
  html = raw.replace(/<style>.*<\/style>/gis, '')
    .replace(/(\$[^\!])/gim, '$1%p%')

  // get book name
  bookName = html.match(/\\"([^"]*)"/im);
  if (!bookName) {
    bookName = "";
  } else {
    bookName = bookName[1];
  }

  // indetify page breaks
  pages = html.split(/%p%/gim);

  // replace page breaks
  for (var i = 0; i < pages.length; i++) {
    pages[i] = pages[i].replace(/\$\!/gim, '</div><div class="page">')
    pages[i] = pages[i].replace(/\$/gim, '</div><div class="page"><div class="page-number">' + (i+1) + '</div><div class="book-name">' + bookName + '</div><div class="chapter-name">%cp%</div>')
  }

  // join pages
  html = "";

  for (var i = 0; i < pages.length; i++) {
    html += pages[i];
  }


    html =  html.

  // custom markdown
  html = html.replace(/\\"([^"]*)"/im, '<title>$1</title>')
    .replace(/^\#\>\s?"([^"]*)"/gim, '<div class="header" style="">$1</div>')

    //gallery images
    .replace(/^\\gallery(\w)?\s?(?:(\d+))?\s?(?:(\d+))?\s?\[([^\]]*?)\]/gim, '<div class="gallery $1" style="height: $2%;grid-template-rows: repeat($2, 1fr); width: $3%; grid-template-columns: repeat($3, 1fr);">$4</div>')
    .replace(/^\\imgc\s?"([^"]*)"(?:\s?"([^"]*?)")?(?:\s?w\:(\d*))?(?:\s?h\:(\d*))?(?:\s?([^\n]+))?/gim, '<div class="img-card" style="grid-column: $3 span; grid-row: $4 span; $5"><img src="/user/images/$1.png"><div class="img-label">$2</div></div>')
    .replace(/^\\empty\s?(?:\s?w\:(\d*))?(?:\s?h\:(\d*))?(?:\s?([^\n]*))?/gim, '<div class="empty" style="grid-column: $1 span; grid-row: $2 span; $3"></div>')

    //single images
    .replace(/^\\img(\w)?\s?"([^"]*)"(?:\s?"([^"]*?)")?(?:\s?([^\n]+))?/gim, '<div class="img $1" style="$4"><img src="/user/images/$2.png"><div class="img-label">$3</div></div>')
    .replace(/\\n/gim, '<br>')

    // vanilla markdown
    .replace(/^\#\s?([^\#\n]+)/gim, '%c%<h1>$1</h1>')
    .replace(/^\#\#\s?([^\#\n]+)/gim, '<h2>$1</h2>')
    .replace(/^\#\#\#\s?([^\#\n]+)/gim, '<h3>$1</h3>')
    .replace(/^\#\#\#\#\s?([^\#\n]+)/gim, '<h4>$1</h4>')
    .replace(/^\#\#\#\#\#\s?([^\#\n]+)/gim, '<h5>$1</h5>')
    .replace(/^\>\s?([^\#\n]+)/gim, '<blockquote>$1</blockquote>')
    .replace(/^([^\#\n\<\\\>\%].+)/gim, '<p>$1</p>')
    .replace(/^\^/gim, '<p>  </p>')
    .replace(/(\n{2}\n+)/gim, '<div class="paragraph-break"></div>')

  // identify chapter ends
  chapters = html.split(/%c%/gim);

  // replace chapter ends
  for (var i = 1; i < chapters.length; i++) {

    let chaptername = chapters[i].match(/(?:\<h1>)(.*)(?:\<\/h1\>)/i)
    chaptername = chaptername[0].replace(/(?:\<h1>[\s\d\.]*)(\w+(?:\s+[\w\.]+)*).*/gim, '$1')

    chapters[i] = chapters[i].replace(/%cp%/gim, chaptername)
    chaptersPush[i] = chapters[i].replace(/%cp%/gim, chaptername)
  }

  chapters[0] = chapters[0].replace(/%cp%/gim, '')
  chaptersPush[0] = chapters[0];

  html = "";

  for (var i = 0; i < chapters.length; i++) {
    html += chaptersPush[i];
  }

  html = html.replace(/(?:\<div class="book-name"\>.*?\<\/div\>\n*?)(?:\<div class="chapter-name"\>.*?\<\/div\>\n*?)(\<h1>.*?\<\/h1\>)/g, '$1')

  // replace caret marker with actual graphical representation
  html = html.replace(/\<!/gim, '<mark>!</mark>')

  return html
}

function renderPreview(html) {
  return `<div class="book">
            <div class="page toc">
              ${html}
            </div>
          </div>
            `
}

function pushPreview(value) {
  html = visibleCaret(value);
  html = parseMarkdown(html);
  html = renderPreview(html);

  //update markdownText value
  markdownText = value;
  editorHighlights.textContent = value;
  //update preview
  preview.innerHTML = html;
}

function initParseOnLoad() {
  if (storedMarkdown) {
    textEditor.value = storedMarkdown;
    pushPreview(storedMarkdown);
  } else {
    pushPreview(textEditor.textContent);
  }
}
