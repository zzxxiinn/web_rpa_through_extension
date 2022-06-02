// eslint-disable-next-line no-unused-vars
import { sendMessage, clickByXpath, clickBySelector } from '../utils'

function init () {
  console.log('init-next')
  const query = window.executeParams
  const { xpath, tabId, directive, selector } = query
  if (xpath) {
    clickByXpath(xpath)
  } else if (selector) {
    clickBySelector(selector)
  }
  sendMessage({ directive, res: { tabId, url: window.location.href } })
}
init()
