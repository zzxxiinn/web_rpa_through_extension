import { sendMessage, clickBySelector, clickByXpath } from '../../utils'

export default function clickElement (params) {
  const { selector, xpath, directive } = params
  if (selector) {
    clickBySelector(selector)
  } else if (xpath) {
    clickByXpath(xpath)
  }
  sendMessage({ directive, res: { tabId: window.tabId, frameId: window.frameId, url: window.location.href } })
}
