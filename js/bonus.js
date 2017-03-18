navigator.mediaDevices.getUserMedia({video: true}).then(gotUserMedia, handleError)

function gotUserMedia (localMediaStream) {
  const video = document.createElement('video')
  video.autoplay = true
  video.addEventListener('loadeddata', onVideoReady)
  video.src = window.URL.createObjectURL(localMediaStream)
  document.body.appendChild(video)
}

function handleError (error) {
  console.error(error)
}

function onVideoReady () {
  console.info('Loaded video data')
  const videoHeight = this.videoHeight
  const videoWidth = this.videoWidth
  const canvas = createCanvas(videoWidth, videoHeight)
  drawVideoOnCanvas(canvas, this)
}

function createCanvas (width, height) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  document.body.appendChild(canvas)
  return canvas
}

function drawVideoOnCanvas (canvas, video) {
  requestAnimationFrame(() => drawVideoOnCanvas(canvas, video))
  const ctx = canvas.getContext('2d')
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
}