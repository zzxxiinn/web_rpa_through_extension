import utils from './utils.js'

const {
  removeAllStyle,
  getIsCapture,
  addCaptureEvent,
  removeMask
} = utils
async function init () {
  if (window.isCaptureInject) {
    return
  }
  const labels = document.body.getElementsByTagName('*')
  let isOpen = await getIsCapture() || false
  console.log(isOpen)

  if (isOpen) {
    addCaptureEvent(labels)
  } else {
    removeAllStyle(labels)
    removeMask()
  }
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    isOpen = request.isOpen
    console.log(request)
    if (request.isOpen === true) {
      addCaptureEvent(labels)
    } else {
      console.log('remove')

      removeAllStyle(labels)
      removeMask()
    }
    window.isCaptureInject = true
    return true
  })
}
init()
