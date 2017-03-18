let transform = null
let img = new Image()

img.src = '/img/logo-cnn.png'

navigator.mediaDevices.getUserMedia({video: true}).then(gotUserMedia, handleError)

document.querySelector('#clear').addEventListener('click', () => transform = null)
document.querySelector('#red').addEventListener('click', () => transform = 'RED')
document.querySelector('#yellow').addEventListener('click', () => transform = 'YELLOW')
document.querySelector('#blue').addEventListener('click', () => transform = 'BLUE')
document.querySelector('#ired').addEventListener('click', () => transform = 'IRED')
document.querySelector('#iyellow').addEventListener('click', () => transform = 'IYELLOW')
document.querySelector('#iblue').addEventListener('click', () => transform = 'IBLUE')


function gotUserMedia (mediaStream) {
  const video = document.createElement('video')
  document.querySelector('#stop').addEventListener('click', () => mediaStream.getVideoTracks()[0].stop())
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
  const ctx = canvas.getContext('2d')
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
  } else if (transform === 'IRED') {
    ctx.putImageData(negateRed(canvasData, true),0,0)
  } else if (transform === 'IYELLOW') {
    ctx.putImageData(negateYellow(canvasData, true),0,0)
  } else if (transform === 'IBLUE') {
    ctx.putImageData(negateBlue(canvasData, true),0,0)
  }

  drawCNNLogo(ctx)
}

function negateRed (imageData, invert) {
  // 20 to 0 or 360 to 340
  return negateColorInData(imageData, invert, 0, 25, 320, 360)
}

function negateYellow (imageData, invert) {
  // 70 to 45
  return negateColorInData(imageData, invert, 35, 95)
}

function negateBlue (imageData, invert) {
  // 260 to 165
  return negateColorInData(imageData, invert, 165, 260)
}

function negateColorInData(imageData, invert, minHue, maxHue, minHue2, maxHue2) {
  let data = imageData.data
  let j = 0
  for (let i = 0; i < data.length; i += 4) {
    let hslColor = rgbToHsl(data[i], data[i + 1], data[i + 2])
    const hue = hslColor[0] * 360
    const colorMatchRange = hue > minHue && hue < maxHue
    const colorMatchSecRange = minHue2 !== undefined && hue > minHue2 && hue < maxHue2
    if (colorMatchRange || colorMatchSecRange) {
      if (invert) {
        hslColor[0] = ((hue +  180) % 360) / 360
      } else {
        hslColor[1] = 0
      }
      let newRGBColor = hslToRgb(hslColor[0], hslColor[1], hslColor[2])
      data[i] = newRGBColor[0]
      data[i + 1] = newRGBColor[1]
      data[i + 2] = newRGBColor[2]
    }
  }
  return imageData
}

function drawCNNLogo (ctx) {
  const prop = img.naturalHeight / img.naturalWidth
  const width = 30
  ctx.drawImage(img, 5, 5, width, width * prop)
}