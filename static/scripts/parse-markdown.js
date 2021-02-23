
// ----------------Render Preview----------------

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

function parseMarkdown(raw) {

  getCSS(raw);

  // get rid of css
  html = raw.replace(/<style>.*<\/style>/gis, '')
    .replace(/(\\page.*)$/gim, '$1%p%')

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
    pages[i] = pages[i].replace(/^\\pageauto.*$/gim, '</div><div class="page"><div class="page-number">' + i + '</div><div class="book-name">' + bookName + '</div><div class="chapter-name">%cp%</div>')
    pages[i] = pages[i].replace(/^\\page.*$/gim, '</div><div class="page">')
  }

  // join pages
  html = "";

  for (var i = 0; i < pages.length; i++) {
    html += pages[i];
  }

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
    .replace(/^([^\#\n\<\\\>\%]+)/gim, '<p>$1</p>')
    .replace(/(\n\n\n+)/gim, '<div class="paragraph-break"></div>')

    // caret position
    .replace(/\^/gim, '<mark>!</mark>')

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

  return html
}

function renderPreview(html) {
  return `<div class="book">
            <div class="toc">
              ${html}
            </div>
          </div>
            `
}

function pushPreview(value) {
  html = parseMarkdown(value);
  html = renderPreview(html);

  //update markdownText value
  markdownText = value;
  //update preview
  preview.innerHTML = html;
}

// Update Preview
textEditor.addEventListener('keyup', debounce(evt => {

  const { value } = evt.target;

  pushPreview(value);

}, 100))

if (storedMarkdown) {
  textEditor.value = storedMarkdown;
  pushPreview(storedMarkdown);
} else {
  pushPreview(textEditor.textContent);
}
