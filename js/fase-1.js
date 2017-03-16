navigator.getUserMedia({video: true}, gotUserMedia, handleError)

function gotUserMedia (camStram) {
  // Handle camera streaming
  console.info('Got the stream!', camStram)
}

function handleError (error) {
  console.error(error)
}