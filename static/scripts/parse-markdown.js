
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
    pages[i] = pages[i].replace(/^\\page.*$/gim, '</div><div class="page"><div class="book-name">' + bookName + '</div>')
  }

  // join pages
  html = "";

  for (var i = 0; i < pages.length; i++) {
    html += pages[i];
  }

  // custom markdown
  html = html.replace(/\\"([^"]*)"/im, '<title>$1</title>')
    .replace(/^\#\>\s?"([^"]*)"/gim, '<div class="header" style="">$1</div>')

    //images
    .replace(/^\\imgL\s?"([^"]*)"(?:\s?"([^"]*)")?(?:\s?\w\:([^\n]*))?/gim, '<div class="imgL" style="width:$3;"><img src="/usr/images/$1.png"><div class="img-label">$2</div></div>')
    .replace(/^\\imgR\s?"([^"]*)"(?:\s?"([^"]*)")?(?:\s?\w\:([^\n]*))?/gim, '<div class="imgR" style="width:$3;"><img src="/usr/images/$1.png"><div class="img-label">$2</div></div>')
    .replace(/^\\img\s?"([^"]*)"(?:\s?"([^"]*)")?(?:\s?\w\:([^\n]*))?/gim, '<div class="img" style="width:$3;"><img src="/usr/images/$1.png"><div class="img-label">$2</div></div>')
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

  // identify chapter ends
  chapters = html.split(/%c%/gim);

  // replace chapter ends
  for (var i = 1; i < chapters.length; i++) {

    let chaptername = chapters[i].match(/(?:\<h1>)(.*)(?:\<\/h1\>)/i)
    chaptername = chaptername[0].replace(/(?:\<h1>[\s\d\.]*)(\w+(?:\s+\w+)?(?:\s+\w+)?).*/gim, '$1')

    chapters[i] = chapters[i].replace(/%cp%/gim, chaptername)
    chaptersPush[i] = chapters[i].replace(/%cp%/gim, chaptername)
  }

  chapters[0] = chapters[0].replace(/%cp%/gim, '')
  chaptersPush[0] = chapters[0];

  html = "";

  for (var i = 0; i < chapters.length; i++) {
    html += chaptersPush[i];
  }

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
