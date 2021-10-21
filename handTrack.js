function initHandTrack(){
  const modelParms = {
    flipHorizontal: true,
    imageScaleFactor: 0.7,
    maxNumBoxes: 20,
    iouThreshold: 0.5,
    scoreThreshold: 0.75,
  }

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

  // Select Dom 
  const video = document.querySelector('#video')
  const cursorImg = document.querySelector("#cursor");

  //Variables
  let model


  handTrack.startVideo(video).then(status =>{
    if(status){
      navigator.getUserMedia({video: {}}, stream => {
        video.srcObjects = stream
        setInterval(runDetection, 100)
        draw()
      },
      err => console.log(err)
      )
    }
  })

  const runDetection = () => {
    model.detect(video).then(predictions => {
      for (let i = 0; i < predictions.length; i++) {
        if(predictions[i].label === 'closed'){
          let x = Math.floor(predictions[i].bbox[0] - predictions[i].bbox[2]/2) / 500 * innerWidth
          let y = Math.floor(predictions[i].bbox[1] - predictions[i].bbox[2]/2) / 340 * innerHeight
          cursor = { label: predictions[i].label, x: x, y: y}
          break
        }
      }
    })
  }

  function draw() {
    // ctx.beginPath();
    // ctx.strokeStyle = 'pink'
    // const positionx = cursor.x
    // const positiony = cursor.y
    // ctx.arc(positionx, positiony, 10, 0, 2 * Math.PI);
    // ctx.stroke();

    ctx.drawImage(cursorImg, cursor.x - 25 , cursor.y - 25, 50, 50 )

    requestAnimationFrame(draw)
  }

  handTrack.load(modelParms).then(Imodel => {
    model = Imodel
  })
}