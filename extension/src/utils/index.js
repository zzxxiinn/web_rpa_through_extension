
import { TabsApi } from '../background/services/chromeApi'

export const sendMessage = (messageConfig) => {
  chrome.runtime.sendMessage(messageConfig, () => {
  })
}

export const getDomListByXpath = (xpath) => {
  const nodes = []
  try {
    const list = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null)
    let res = list.iterateNext()
    while (res) {
      nodes.push(res)
      res = list.iterateNext()
    }
  } catch (e) {
    console.error(e)
  }
  return nodes
}

export function sendMessageToTab (tabId, message) {
  return new Promise((resolve, reject) => {
    try {
      chrome.tabs.sendMessage(tabId, message, (response) => {
        resolve(response)
      })
    } catch (e) {
      reject(e)
    }
  })
}
export function injectCapture (tabId, force = false) {
  console.log('inject')
  chrome.scripting.executeScript({
    target: { tabId },
    func: function (forceInject) {
      if (forceInject) {
        window.isCaptureInject = false
      }
    },
    args: [force]
  }, function () {
    chrome.scripting.executeScript({ target: { tabId }, files: ['js/content.js'] })
  })
}
export const clickByXpath = (xpath, isSingle = true) => {
  const nodes = getDomListByXpath(xpath)
  if (nodes.length === 0) {
    return
  }
  function clickNode (node) {
    node.click()
  }
  if (isSingle) {
    clickNode(nodes[0])
  } else {
    for (const node of nodes) {
      clickNode(node)
    }
  }
}

function clickNode (node) {
  node.click()
}
export const getDomListBySelector = (selector) => {
  const nodes = document.querySelectorAll(selector)
  console.log(nodes)
  return nodes
}
export const clickBySelector = (selector, isSingle = true) => {
  const nodes = getDomListBySelector(selector)
  if (nodes.length === 0) {
    return
  }
  if (isSingle) {
    clickNode(nodes[0])
  } else {
    for (const node of nodes) {
      clickNode(node)
    }
  }
}
export const generatorDirective = (name) => {
  return async (data) => {
    const tabsApi = new TabsApi()
    let tabs = []
    let tab = null
    if (data.tabId) {
      tab = await tabsApi.get(data.tabId)
      console.log(tabs)
    }
    if (!tab) {
      const url = data.url.split('#')[0]
      tabs = await tabsApi.query({ url: url })
      tab = tabs[0]
    }
    if (!tab) {
      return
    }
    console.log('generatorDirective', data, tab)
    const res = await tabsApi.executeDirective(tab.id, name, data)
    return res
  }
}
