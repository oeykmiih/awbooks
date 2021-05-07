//<--------- editor-highlights --------->

function applyHighlights(text) {
  text = text
    .replace(/\$(\!)?/gim, '<highlight-page>X$1</highlight-page>')
    .replace(/^(\#\s?[^\#\n]+)/gim, '<highlight-h1>$1</highlight-h1>')
    .replace(/^(\#\#\s?[^\#\n]+)/gim, '<highlight-h2>$1</highlight-h2>')
    .replace(/\\n/g, '<highlight-br>$1</highlight-br>')
    .replace(/^\^/gm, '<highlight-page>^</highlight-page>')

    return text
}

function textHighlights() {
  editor_hightlights.innerHTML = applyHighlights(editor_hightlights.textContent);
  handleScroll();
}

function handleScroll() {
  let scroll = editor.scrollTop;
  editor_hightlights.scrollTop = scroll;
}