// Variables
let initialValue = document.querySelector('.scale-box-text').textContent;


// Get HTML
const scaleBox = document.querySelector('.scale-box-text')

function setScale(value){
  scaleValue = value / 100;
  console.log(scaleValue);
  preview.style.transform = "scale(" + scaleValue + ")";
}

scaleBox.addEventListener('keyup', evt => {
  const {
    value
  } = evt.target;
  setScale(value);
})

setScale(initialValue);
