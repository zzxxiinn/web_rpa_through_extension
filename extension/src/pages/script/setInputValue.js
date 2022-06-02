import { sendMessage, getDomListByXpath, getDomListBySelector } from '../utils'

function init () {
  console.log('execute')
  const query = window.executeParams
  const { selector, xpath, tabId, value, directive } = query
  let inputs = []
  if (selector) {
    inputs = getDomListBySelector(selector)
  } else if (xpath) {
    inputs = getDomListByXpath(xpath)
  }
  console.log(inputs)
  for (const input of inputs) {
    input.value = value
  }
  sendMessage({ directive, res: { tabId, value, url: window.location.href } })
}
init()
