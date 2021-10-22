// Select Dom 
const menuContainer = document.querySelector('#menuContainer')
const checkboxHand = document.querySelector('#checkbox #hand')
const skipBtn = document.querySelector('#skip')
const menuGoList = document.querySelector('#menuGoList')

const canvas = document.createElement('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
canvas.style.backgroundColor = "#141B41"

const ctx = canvas.getContext('2d')

// Init
function init(){
  menuContainer.style.display = 'none'
  if (checkboxHand.checked) {
    initHandTrack()
  } else {
    initMouseEvent()
  }
  skipBtn.style.opacity = 1
  menuGoList.style.display = 'none'
  initBubble()
  initAudioRec()
}

// Variables
let cam = false
let cursor = {
  label: undefined,
  x: undefined,
  y: undefined
}

// Listener
function initMouseEvent(){
  window.addEventListener('mousemove', (e)=>{
    cursor.x = 'mouse'
    cursor.x = e.x
    cursor.y = e.y
  })
}

window.addEventListener('resize', ()=>{
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
})

skipBtn.addEventListener('click', ()=>{
  location.reload();
})

let listMenu = false
const listAudio = document.querySelector('#listAudio')
menuGoList.addEventListener('click', ()=>{
  if (listMenu === false) {
    listMenu = true
    menuContainer.style.transform = 'translateX(-20%)'
    listAudio.style.transform = 'translateX(0)'
    getAudioHistory()
  } else {
    listMenu = false
    menuContainer.style.transform = 'translateX(0)'
    listAudio.style.transform = 'translateX(100%)'
  }
})

//Functions
function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function createRGBAColor(colorHex, opacity) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colorHex);
  const r = parseInt(result[1], 16)
  const g = parseInt(result[2], 16)
  const b = parseInt(result[3], 16)
  const colorRGBA = `rgba(${r}, ${g}, ${b}, ${opacity})`
  return colorRGBA;
}

const app = document.querySelector('#app')
app.appendChild(canvas) 


//History

function audioToView(data){
  const childern = listAudio.querySelectorAll('audio');
  childern.forEach(e => {
    e.remove()
  })
  const childern2 = listAudio.querySelectorAll('span');
  childern2.forEach(e => {
    e.remove()
  })
  data.forEach(audio => {
    const sound = document.createElement('audio');
    const label = document.createElement('span');
    label.innerHTML = audio.name;
    let binary = convertURIToBinary(audio.music);
    let blob = new Blob([binary], {
      type: 'audio/ogg'
    });
    let blobUrl = URL.createObjectURL(blob);
    sound.controls = 'controls';
    sound.src = blobUrl;
    sound.type = 'audio/ogg';
    listAudio.appendChild(label);
    listAudio.appendChild(sound);
  });
}

function getAudioHistory(){
  let results
  fetch('https://bubblemusic.herokuapp.com/api/musics')
    .then(response => response.json())
    .then(json => {
      results = json
      audioToView(results)
    })
}

function convertURIToBinary(dataURI) {
  let BASE64_MARKER = ';base64,';
  let base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  let base64 = dataURI.substring(base64Index);
  let raw = window.atob(base64);
  let rawLength = raw.length;
  let arr = new Uint8Array(new ArrayBuffer(rawLength));

  for (let i = 0; i < rawLength; i++) {
    arr[i] = raw.charCodeAt(i);
  }
  return arr;
}