function initAudioRec(){
  //check if browser supports getUserMedia
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert('Your browser does not support recording!');
    return;
  }

  const recBtn = document.querySelector('#musicPlayer')
  recBtn.style.opacity = 1
  let rec = false
  let init = false
  let mediaRecorder
  let chunks = []

  recBtn.addEventListener('click', ()=>{
    recBtn.classList.toggle('active')
    if(rec === false && init === false){
      initRec()
    }else if(rec === false && init === true){
      startRec()
    }else if(rec === true){
      stopRec()
    }
  })

  function initRec(){
    rec = true
    init = true
    navigator.mediaDevices.getUserMedia({ audio: true }).then(
      (stream) => {
        mediaRecorder = new MediaRecorder(stream)
        mediaRecorder.start();
        // console.log(mediaRecorder.state);

        // Listeners for mediaRecorder
        mediaRecorder.ondataavailable = function(e) {
          chunks.push(e.data);
        }

        mediaRecorder.onstop = function(e) {
          const clipName = prompt('Enter a name for your sound clip')
          const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
          chunks = [];

          const reader = new FileReader();
          reader.onload = function(event){
              const audioData = event.target.result;

              (async () => {
                fetch('http://localhost:5000/api/musics', {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({name: clipName, music: audioData})
                });
              })()
          };
          reader.readAsDataURL(blob);
        }
      })
      .catch((err) => {
        console.log(`The following error occurred: ${err}`);
      }) 
  }

  function startRec(){
    rec = true
    mediaRecorder.start();
    // console.log(mediaRecorder.state);
  }

  function stopRec(){
    rec = false
    mediaRecorder.stop()
    // console.log(mediaRecorder.state);
  }
}