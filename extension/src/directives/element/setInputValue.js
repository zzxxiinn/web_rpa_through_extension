import { sendMessage, getDomListByXpath, getDomListBySelector } from '../../utils'

export default function setInputValue (params) {
  const { selector, xpath, value, directive } = params
  let inputs = []
  if (selector) {
    inputs = getDomListBySelector(selector)
  } else if (xpath) {
    inputs = getDomListByXpath(xpath)
  }
  for (const input of inputs) {
    input.value = value
  }
  sendMessage({ directive, res: { tabId: window.tabId, frameId: window.frameId, value, url: window.location.href } })
}
