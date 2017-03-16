navigator.getUserMedia({video: true}, gotUserMedia, handleError)

function gotUserMedia (localMediaStream) {
  const video = document.createElement('video')
  video.autoplay = true
  video.src = window.URL.createObjectURL(localMediaStream)
  document.body.appendChild(video)
}

function handleError (error) {
  console.error(error)
}