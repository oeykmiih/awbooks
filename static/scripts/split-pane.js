const leftPane = document.querySelector(".left-pane");
const resizer = document.querySelector(".split-pane");
let startX , startWidth;


//Split Pane Resizing
resizer.addEventListener('mousedown', initDrag, false);

function initDrag(e) {
   startX = e.clientX;
   startWidth = parseInt(document.defaultView.getComputedStyle(leftPane).width, 10);
   document.documentElement.addEventListener('mousemove', doDrag, false);
   document.documentElement.addEventListener('mouseup', stopDrag, false);
}

function doDrag(e) {
   leftPane.style.width = (startWidth + e.clientX - startX) + 'px';
}

function stopDrag(e) {
  document.documentElement.removeEventListener('mousemove', doDrag, false);
  document.documentElement.removeEventListener('mouseup', stopDrag, false);
}
