// Audio
const BaseAudioContext = window.AudioContext || window.webkitAudioContext

// Variables
let blobArray = []
let outBlobArray = []
const colourArray = ["#17468A", "#4C8DCA", "#78E5EB", "#F5F0F2", "#E12D53", "#6930c3", "#5e60ce", "#5390d9", "#4ea8de" ]
const noteArray = [261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30]
const sizeBubble = 15

// Elements

class BlobBubble {
  constructor(x, y, dx, dy, radius, color, note, oscillator, gain, ctxA) {
    this.x = x
    this.y = y
    this.dx = dx
    this.dy = dy
    this.radius = radius
    this.color = color
    this.note = note
    this.oscillator = oscillator
    this.gain = gain
    this.ctxA = ctxA

    this.opacity = 0
  }

  draw(){
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.strokeStyle = createRGBAColor(this.color, this.opacity);
    ctx.stroke();
  }

  update() {
    // Movement
    if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
        this.dx = -this.dx
    }
    if (this.y + this.radius > innerHeight || this.y - this.radius < 0){
        this.dy = -this.dy
    }
    this.x += this.dx
    this.y += this.dy
    if (this.opacity < 1) {
      this.opacity = this.opacity + 0.01
    }

    // Hover mouse 
    if(this.x - sizeBubble < cursor.x && this.x + sizeBubble > cursor.x && this.y - sizeBubble < cursor.y && this.y + sizeBubble > cursor.y ){
      // Create outBlob
      const endBlob = new outBlob(this.x, this.y, this.radius, this.color)
      outBlobArray.push(endBlob)

      // Delete this Blob
      const thisBlobI = blobArray.findIndex(blob => blob.x === this.x && blob.y === this.y)
      blobArray.splice(thisBlobI, 1)
      
      // Music
      this.gain.gain.setValueAtTime(0, 0)
      this.gain.gain.linearRampToValueAtTime(0.8, this.ctxA.currentTime + 1 * 0.3)
      this.gain.gain.setValueAtTime(0.8, this.ctxA.currentTime + 1 - 1 * 0.3)
      this.gain.gain.linearRampToValueAtTime(0, this.ctxA.currentTime + 1)
      this.oscillator.frequency.setValueAtTime(this.note, this.ctxA.currentTime)
      
      // Generate new Blob
      initBlob(1)
    }
  }
}

class outBlob {
  constructor(x, y, radius, color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color

    // Others
    this.radius2 = radius - 0.3
    this.opacity = 1
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.strokeStyle = createRGBAColor(this.color, this.opacity);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius2, 0, Math.PI * 2, false);
    ctx.strokeStyle = createRGBAColor(this.color, this.opacity);
    ctx.stroke();
  }

  update(){
    this.radius2 = this.radius2 + 0.1
    this.radius = this.radius + 0.3
    this.opacity = this.opacity - 0.01

    // Delate OutBlob
    if(this.radius > sizeBubble + 40){
      const thisBlobI = outBlobArray.findIndex(blob => blob.x === this.x && blob.y === this.y)
      outBlobArray.splice(thisBlobI, 1)
    }
  }
}

// Init
function initBubble(){
  animate()
  initBlob(40)
}

// Functions
function initBlob(n){
  for (let i = 0; i < n; i++) {
    const radius = sizeBubble
    const x = Math.random() * (innerWidth - radius * 2) + radius
    const y = Math.random() * (innerHeight - radius * 2) + radius
    const dx = (Math.random() - 0.5) * 3
    const dy = (Math.random() - 0.5) * 3
    const rendom = Math.floor(getRandom(0, colourArray.length))
    const color = colourArray[rendom]
    const note = noteArray[rendom]

    // Set Audio
    const ctxAudioBlob = new BaseAudioContext()
    const oscillatorBlob = ctxAudioBlob.createOscillator()
    oscillatorBlob.type = 'sine'
    const gainBlob = ctxAudioBlob.createGain();
    oscillatorBlob.connect(gainBlob)
    gainBlob.connect(ctxAudioBlob.destination)
    gainBlob.gain.value = 0
    oscillatorBlob.start()

    const circle = new BlobBubble( x, y, dx, dy, radius, color, note, oscillatorBlob, gainBlob, ctxAudioBlob)
    blobArray.push(circle)
  }
}

function animate() {
  ctx.clearRect(0, 0, innerWidth, innerHeight)
  blobArray.forEach(blob => {
    blob.draw()
    blob.update()
  })
  outBlobArray.forEach(outBlob => {
    outBlob.draw()
    outBlob.update()
  })
  requestAnimationFrame(animate)
}
  