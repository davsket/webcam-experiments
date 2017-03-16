let transform = null

navigator.getUserMedia({video: true}, gotUserMedia, handleError)

document.querySelector('#clear').addEventListener('click', () => transform = null)
document.querySelector('#red').addEventListener('click', () => transform = 'RED')
document.querySelector('#green').addEventListener('click', () => transform = 'GREEN')
document.querySelector('#blue').addEventListener('click', () => transform = 'BLUE')


function gotUserMedia (localMediaStream) {
  const video = document.createElement('video')
  video.autoplay = true
  video.addEventListener('loadeddata', onVideoReady)
  video.src = window.URL.createObjectURL(localMediaStream)
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
  let canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  switch (transform) {
    case 'RED':
      ctx.putImageData(negateRed(canvasData),0,0)
    case 'GREEN':
      ctx.putImageData(negateGreen(canvasData),0,0)
    case 'BLUE':
      ctx.putImageData(negateBlue(canvasData),0,0)
  }
}

function negateRed (imageData) {
  return negateColorInData(imageData, 0)
}

function negateGreen (imageData) {
  return negateColorInData(imageData, 1)
}

function negateBlue (imageData) {
  return negateColorInData(imageData, 2)
}

function negateColorInData(imageData, colorIndex) {
  let data = imageData.data
  for (let i = 0; i < data.length; i += 4) {
    let colorBase = data[i + colorIndex]
    let colorFirst = data[i + (colorIndex + 1) % 3]
    let colorSecond = data[i + (colorIndex + 2) % 3]
    let isLargerThanFirst = colorBase > colorFirst
    let isLargerThanSecond = colorBase > colorSecond
    if (isLargerThanFirst && isLargerThanSecond) {
      data[i + colorIndex] = Math.floor((colorFirst + colorSecond) / 2)
    }
  }
  return imageData
}