const chosenColorArray = [];
const chosenBackgroundColors = ['white'];
const chosenGradientFirst = [];
const chosenGradientSecond = [];
const inputs = [...document.querySelectorAll('.input-radio')]
const inputRange = document.getElementById('strokeSize')
const inputRangeDisplay = document.getElementById('strokeSizeDisplay')
const cursor = document.querySelector('.cursor');
const cursorMenu = document.querySelector('.option-menu');
const colors = document.querySelectorAll('.color');
const optionMenu = document.querySelector('.option-menu') ;
const buttons = document.querySelectorAll('.background-control ');
const colorsGradient = document.querySelectorAll('.color-gradient');
const colorsSecond =  document.querySelectorAll('.color-fill');
const firstShowcase = document.querySelector('.first-color-show')
const secondShowcase = document.querySelector('.second-color-show')
const dropZone = document.querySelector('.drop-zone')
const types = ['image/png','image/jpg','image/jpeg']
let image 

function dropElements(){
 dropZone.addEventListener('dragover',(e)=>{
    e.preventDefault();
 })

dropZone.addEventListener('drop',(e)=>{
e.preventDefault(); 
image = e.dataTransfer.files[0];
  let typesAllowed = types.includes(image.type)
   switch(typesAllowed){
    case true:
        const reader = new FileReader();
        let fileToRead = image
        reader.readAsDataURL(fileToRead)
        reader.onload = () => {
          dropZone.style.backgroundImage= `url(${reader.result})`;
          document.querySelector('.drop-zone__prompt').innerHTML= ' '  
        }
    break;
    case false:
      console.log(image)
      document.querySelector('.drop-zone__prompt').innerHTML= 'File is Not the Right Type'  
      dropZone.style.backgroundImage='none'
    break;
   }
 })
}
dropElements()

buttons.forEach((btn)=>{
 btn.addEventListener('click',(e)=>{
  let btnsClasslists = e.target.classList[1];
     removeActiveClass()
  switch(btnsClasslists){
    case 'full-color':
        optionMenu.classList.add('fill')
    break;
    case 'gradient':
        optionMenu.classList.add('gradient')
    break;
    case 'image':
        optionMenu.classList.add('photo')
    break;
  }
 })
})

inputs[0].checked = true

function fillColors(which){
which.forEach(function assegnation(color){
    const value = color.getAttribute('data-id')
    color.style.backgroundColor = value;
color.addEventListener('click',(e)=>{
    const container = color.parentElement;
    removeActiveColor();
    container.classList.add('active');
    switch(e.target.classList[0]){
    case 'color':
    chosenColorArray.push(value);
    break;
    case'color-fill': 
    chosenBackgroundColors.push(value)
    break;
    case'color-gradient':
    inputs[0].checked ? pushColor(chosenGradientFirst,value,firstShowcase) : pushColor(chosenGradientSecond,value,secondShowcase)
    break;
   } 
})
})   
}

fillColors(colors)
fillColors(colorsSecond)
fillColors(colorsGradient)

function pushColor(who, what,where){
     who.push(what)   
     where.style.backgroundColor = who[who.length-1]
}

function removeActiveClass(){
    optionMenu.classList.remove('fill')
    optionMenu.classList.remove('gradient')
    optionMenu.classList.remove('photo')
}

function removeActiveColor() {
    colors.forEach((color)=>{
        const container = color.parentElement;
        container.classList.remove('active')
    })
}
//brushSize
inputRange.addEventListener('change',(e)=>{
    let newValue = inputRange.value
    inputRangeDisplay.innerHTML = newValue
    cursor.style.height = `${newValue *2}px` 
    cursor.style.width = `${newValue *2}px` 
})

// canvas stuff starts HERE!!!!!!

window.addEventListener('load',()=>{
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d');
const resetBtn = document.getElementById('reset-btn');
const confirmBtn = document.getElementById('confirm-btn');
const saveImg = document.getElementById('save-btn');

canvas.width =1000;
canvas.height=500;

let painting = false;

//eventlisteners

resetBtn.addEventListener('click',deleteAll)
confirmBtn.addEventListener('click',changeBack)
canvas.addEventListener('pointerdown', paintingStarts);
canvas.addEventListener('pointerup', paintingEnds);
canvas.addEventListener('pointermove', paintingIs);
canvas.addEventListener('pointerleave', paintingEnds);
canvas.addEventListener('pointermove', cursorMove);
saveImg.addEventListener('click',saveImgFunction)
//functions

function changeBack(){
    const optionMenuWhich = optionMenu.classList;
    const option = optionMenuWhich[1] 
    ctx.globalAlpha = 1;
    switch(option) {
    
    case 'fill':
    const colorBackGround = chosenBackgroundColors[chosenBackgroundColors.length-1]
        ctx.fillStyle = colorBackGround
        ctx.fillRect(0,0,canvas.width,canvas.height)    
    break;
    
    case 'gradient':
        const shadeBackgroundOne = chosenGradientFirst[chosenGradientFirst.length-1];
        const shadeBackgroundTwo = chosenGradientSecond[chosenGradientSecond.length-1];
        console.log(shadeBackgroundOne, shadeBackgroundTwo)
        let gradientEl =  ctx.createLinearGradient(0,0,canvas.width,canvas.height) ;
        gradientEl.addColorStop(0,shadeBackgroundOne);
        gradientEl.addColorStop(1,shadeBackgroundTwo);
        ctx.fillStyle = gradientEl;
        ctx.fillRect(0, 0, canvas.width,canvas.width);
       
    break;
    
    case 'photo':
        backgroundImageCreate()
    break;
    }
     
}

function backgroundImageCreate() {
    console.log(image)
       let imgObject = new Image();
     imgObject.onload = () =>{
        ctx.drawImage(imgObject,0,0)
        }
        imgObject.src = image.name
}

function paintingStarts(){
        painting=true;
}

function cursorMove(e){
    let Y = e.clientY
    let X = e.clientX 
    cursor.style.top = Y + 'px'
    cursor.style.left = X + 'px'
    cursor.style.top = Y + 'px'
    cursor.style.left = X + 'px'
}

function paintingEnds(){
    painting=false;
    ctx.beginPath(); 
}

function deleteAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function paintingIs(e){
    if(!painting) return
     let color = chosenColorArray[chosenColorArray.length-1]
    let Y = e.clientY - e.target.offsetTop
    let X = e.clientX - e.target.offsetLeft
    ctx.lineWidth = inputRange.value *2
    ctx.lineCap = 'round'
    ctx.globalAlpha = e.pressure/2;
    ctx.lineTo(X,Y)
    ctx.stroke(); 
    ctx.strokeStyle = color;
    ctx.moveTo(X,Y);
 }
 function saveImgFunction() {
  if(window.navigator.msSaveBlob) {
    window.navigator.msSaveBlob(canvas.msSaveBlob(), 'canvas-image.png') 
  } else {
    const a = document.createElement('a');
    document.body.appendChild(a)
    a.href = canvas.toDataURL();
    a.download = 'canvas-image.png';
    a.click();
    document.body.removeChild(a);
  }
 }
})