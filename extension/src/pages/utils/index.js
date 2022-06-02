
export const sendMessage = (messageConfig) => {
  chrome.runtime.sendMessage(messageConfig, () => {
  })
}
export const queryTabs = (query = {}) => {
  return new Promise((resolve, reject) => {
    try {
      chrome.tabs.query(query, function (tabs) {
        resolve(tabs)
      })
    } catch (e) {

    }
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
export function setStorage (params) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.sync.set({ ...params }, function () {
        resolve(params)
      })
    } catch (e) {
      reject(e)
    }
  })
}
export function getStorage (getList) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.sync.get(getList, function (result) {
        resolve(result)
      })
    } catch (e) {
      reject(e)
    }
  })
}

export async function executeScript ({ tabId, query, files }) {
  chrome.scripting.executeScript({
    target: { tabId },
    func: function (query) {
      window.executeParams = query
    },
    args: [{ ...query, tabId }]
  }, function () {
    chrome.scripting.executeScript({ target: { tabId }, files })
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
    let tabs = []
    if (data.tabId) {
      tabs = await chrome.tabs.query().filter(i => i.id === data.tabId)
    }
    if (tabs.length === 0) {
      const url = data.url.split('#')[0]
      tabs = await chrome.tabs.query({ url: url })
    }
    console.log(tabs)
    if (tabs.length === 0) {
      return
    }
    const tab = tabs[0]
    executeScript(
      {
        tabId: tab.id,
        query: { ...data, directive: name },
        files: [`js/${name}.js`]
      })
  }
}
