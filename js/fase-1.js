navigator.mediaDevices.getUserMedia({video: true}).then(gotUserMedia, handleError)

function gotUserMedia (camStram) {
  // Handle camera streaming
  console.info('Got the stream!', camStram)
}

function handleError (error) {
  console.error(error)
}