// Variables
let markdownText = document.querySelector('.text-editor').textContent;
let cssText = "";
let html;
let htmlSTA;
let bookName = "book title";

// Get HTML
const textEditor = document.getElementById('text-editor');
const preview = document.querySelector('.preview');
const printButton = document.getElementById("print-button");

// Get CSS
const cssMain = loadFile('../../static/css/main.css');
const cssPage = loadFile('../../static/css/page.css');
const cssCustom = document.getElementById('cssCustom');
let css = cssPage + cssText;

function loadFile(filePath) {
    fetch(filePath).then(function(response) {
    return response.text().then(function(text) {
      return text;
    });
  });
}


// ----------------Render Preview----------------

// Parse Markdown
function parseMarkdown(raw) {

  //Get CSS from raw
  cssText = raw    .match(/<style>.*<\/style>/gis);
  if (cssText == null) {
    cssText = "";
  }
  cssText[0] = String(cssText).replace(/<\/*style>/gis, '');
  cssCustom.textContent = cssText[0];

  let htmlText = raw

  // cleanup raw
    .replace(/<style>.*<\/style>/gis, '')

  // Added Syntax

    .replace(/^\\"(.+)"$/im, '<title>$1</title>')
    .replace(/^\\pageauto$/gim, '<div class="page-number auto"></div></div><div class="page"><div class="book-name">'+bookName[1]+'</div>')
    .replace(/^\\page\s(\d+)$/gim, '<div class="page-number">$1</div></div><div class="page"><div class="book-name">'+bookName[1]+'</div>')
    .replace(/^\\page$/gim, '</div><div class="page"><div class="book-name">'+bookName[1]+'</div>')
    .replace(/^\\auto$/gim, '<div class="page-number auto"></div>')
    .replace(/^\\bookname$/gim, '')
    .replace(/^\#\> "(.+)"/gim, '<div class="header" style="">$1</div>')

    .replace(/\\imgL "(.+)" "(.+)"/gim, '<div class="imgL"><img src="$1" ><div class="img-label">$2</div></div>')
    .replace(/\\imgL "(.+)"/gim, '<div class="imgL"><img src="$1" ></div>')
    .replace(/\\imgR "(.+)" "(.+)"/gim, '<div class="imgR"><img src="$1" ><div class="img-label">$2</div></div>')
    .replace(/\\imgR "(.+)"/gim, '<div class="imgR"><img src="$1" ></div>')


  // Base Syntax
    .replace(/^# (.*)/gim, '<h1>$1</h1>')
    .replace(/^## (.*)/gim, '<h2>$1</h2>')
    .replace(/^### (.*)/gim, '<h3>$1</h3>')
    .replace(/^#### (.*)/gim, '<h4>$1</h4>')
    .replace(/^##### (.*)/gim, '<h5>$1</h5>')
    .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
    .replace(/^\-(.+)/gim, '<p style="text-indent: 0rem;">$1</p>')
    .replace(/^([^\<\n]+)/gim, '<p>$1</p>')
    .replace(/^(\n\n)/gim, '<div class="paragraph-break"></div>')
    .replace(/\\n/gim, '<br>')
 


    // .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
    // .replace(/\*(.*)\*/gim, '<i>$1</i>');

// To Review

    // .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' />")
    // .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>")
    // .replace(/^(\w.*)/gim, '<p>$1</p>')

  return htmlText.trim()
}

// Get  title
function getTitle(raw){

  bookName = raw.match(/^\\"([\w ,\.\?\;\-\'\/]+)"$/im)

  if (bookName == null) {
    bookName = new Array("book title","book title");
  }
}

// Prepare HTML to Preview
function renderPreview(html) {
  return `<div class="book">
            <div class="toc">
              ${html}
            </div>
          </div>
            `
}

// Render to Preview
function pushPreview(value){
  title = getTitle(value);
  html = parseMarkdown(value);
  html = renderPreview(html);

  //Update markdownText
  markdownText = value;
  preview.innerHTML = html;
}

// Update Preview
textEditor.addEventListener('keyup', evt => {
  const {
    value
  } = evt.target;
  pushPreview(value);
})

// Prevents Preview from being blank
pushPreview(textEditor.textContent);

// ----------------Render Standalone----------------

// Prepare Standalone HTML file
function renderSTA(html, css) {
  return `
	<!DOCKTYPE html>
	  <html>

	  <head>
	    <style>
	      ${css}
	    </style>
	  </head>

	  <body>
    <div class="right-pane">
      <div class="preview">
  	    <div class="book">
  	      <div class="toc">
  	        ${html}
  	      </div>
  	    </div>
      </div>
      </div>
	  </body>

	  </html>
    `;
};

//Rende Standalone HTML File
function pushSTA(markdownText, css){
  htmlSTA = parseMarkdown(markdownText);
  htmlSTA = renderSTA(htmlSTA, css);
	console.log('render!');
	return(htmlSTA);
}

// Output File
// printButton.addEventListener('click', function(){
//   renderSTA(markdownText, css);
//   var filename = 'test.html';
//   var type = 'text/html';
//   download(htmlSTA, filename, type);
//   }, false)
//
//
//   function download(data, filename, type) {
//       var file = new Blob([data], {type: type});
//       if (window.navigator.msSaveOrOpenBlob) // IE10+
//           window.navigator.msSaveOrOpenBlob(file, filename);
//       else { // Others
//           var a = document.createElement("a"),
//                   url = URL.createObjectURL(file);
//           a.href = url;
//           a.download = filename;
//           document.body.appendChild(a);
//           a.click();
//           setTimeout(function() {
//               document.body.removeChild(a);
//               window.URL.revokeObjectURL(url);
//           }, 0);
//       }
//   }
