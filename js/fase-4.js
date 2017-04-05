let transform = null

navigator.mediaDevices.getUserMedia({video: true}).then(gotUserMedia, handleError)

document.querySelector('#clear').addEventListener('click', () => transform = null)
document.querySelector('#red').addEventListener('click', () => transform = 'RED')
document.querySelector('#yellow').addEventListener('click', () => transform = 'YELLOW')
document.querySelector('#blue').addEventListener('click', () => transform = 'BLUE')

function gotUserMedia (mediaStream) {
  const video = document.createElement('video')
  video.autoplay = true
  video.addEventListener('loadeddata', onVideoReady)
  video.src = window.URL.createObjectURL(mediaStream)
}

function handleError (error) {
  console.error(error)
}

function onVideoReady (e) {
  console.info('Loaded video data')
  const video = e.target
  const proportion = 0.5
  const videoWidth = video.videoWidth * proportion
  const videoHeight = video.videoHeight * proportion
  const canvas = createCanvas(videoWidth, videoHeight)
  canvas.style.width = video.videoWidth + 'px'
  canvas.style.height = video.videoHeight + 'px'
  drawVideoOnCanvas(canvas, video)
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
  if (transform === 'RED') {
    ctx.putImageData(negateRed(canvasData),0,0)
  } else if (transform === 'YELLOW') {
    ctx.putImageData(negateYellow(canvasData),0,0)
  } else if (transform === 'BLUE') {
    ctx.putImageData(negateBlue(canvasData),0,0)
  }
}

function negateRed (imageData) {
  // 25 to 0 or 360 to 320
  return negateColorInData(imageData, 0, 25, 320, 360)
}

function negateYellow (imageData) {
  // 90 to 45
  return negateColorInData(imageData, 45, 90)
}

function negateBlue (imageData) {
  // 260 to 165
  return negateColorInData(imageData, 165, 260)
}

function negateColorInData(imageData, minHue, maxHue, minHue2, maxHue2) {
  let data = imageData.data
  for (let i = 0; i < data.length; i += 4) {
    let hslColor = rgbToHsl(data[i], data[i + 1], data[i + 2])
    const hue = hslColor[0] * 360
    const colorMatchRange = hue > minHue && hue < maxHue
    const colorMatchSecRange = minHue2 !== undefined && hue > minHue2 && hue < maxHue2
    if (colorMatchRange || colorMatchSecRange) {
      hslColor[1] = 0
      let newRGBColor = hslToRgb(hslColor[0], hslColor[1], hslColor[2])
      data[i] = newRGBColor[0]
      data[i + 1] = newRGBColor[1]
      data[i + 2] = newRGBColor[2]
    }
  }
  return imageData
}