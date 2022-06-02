import { setStorage, queryTabs, sendMessageToTab, injectCapture, generatorDirective } from '../utils'
const backgroundService = new function () {
  this.isOpen = false
  this.toNextTabId = null
  this.nextPageUrl = ''
  this.setOpen = async function (isOpen) {
    await setStorage({ isOpen })
    const tabs = await queryTabs({})
    for (const tab of tabs) {
      injectCapture(tab.id)
      sendMessageToTab(tab.id, { isOpen: isOpen })
    }
    this.isOpen = isOpen
  }
  this.getPageData = function (config) {
    // eslint-disable-next-line no-unused-vars
    const { url, type, columns } = config
  }
}()
const directiveMap = {
  getPageData: true,
  clickByXpath: true,
  toNextPage: true,
  setInputValue: true,
  executeScript: true
}
let websocket = null
const MessageHost = function () {
  const wsServer = 'ws://localhost:3058/action'
  this.sendMessage = function (message) {
    console.log(message)
    if (typeof (message) === 'string') {
      websocket.send(message)
    } else {
      websocket.send(JSON.stringify(message))
    }
  }
  this.createSocket = function () {
    if (websocket) {
      websocket.close()
    }
    websocket = new WebSocket(wsServer)
    websocket.onopen = (evt) => {
      console.log('onopen -->', evt)
      // this.sendMessage({ type: 'ping', content: 'hello' })
    }
    websocket.onclose = (evt) => {
      this.reconnect()
    }
    websocket.onmessage = async (evt) => {
      let { data = {} } = evt
      try {
        data = JSON.parse(data)
      } catch (e) {
      }
      if (data.directive === 'select') {
        backgroundService.setOpen(true)
      } else if (data.directive === 'cancelSelect') {
        backgroundService.setOpen(false)
      } else if (data.directive === 'openPage') {
        const res = await chrome.tabs.create({
          url: data.data.url
        })

        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
          console.log('tabs_update', tabId, changeInfo, tab)
          if (tab.id === res.id && tab.status === 'complete') {
            this.sendMessage({ directive: 'openPage', res: { url: res.pendingUrl, tabId: res.id } })
          }
        })

        console.log(res)
      } else if (data.directive === 'closePage') {
        let tabIds = []
        let tabs = []
        let url = data.data.url
        const tabId = data.data.tabId
        if (url) {
          tabs = await chrome.tabs.query({ url: data.data.url })
        } else if (tabId) {
          tabs = (await chrome.tabs.query()).filter(i => i.id === tabId)
          if (tabs.length > 0) {
            url = tabs.url
          }
        }
        if (tabs.length) {
          tabIds = tabs.map(i => i.id)
          const res = await chrome.tabs.remove(tabIds)
          console.log(res)
        }
        this.sendMessage({ directive: 'closePage', res: { url, tabIds } })
      } else if (directiveMap[data.directive]) {
        console.log(data.directive, data.data)
        const directive = generatorDirective(data.directive)
        directive(data.data)
      }
    }
    websocket.onerror = (evt) => {
      console.log('onerror ->', evt)
      this.reconnect()
    }
  }
  this.reconnect = function (url) {
    console.log('reconnect')
    if (this.timer) {
      return
    }
    this.timer = setTimeout(() => {
      this.createSocket()
      this.timer = null
    }, 1000)
  }
}

chrome.runtime.onInstalled.addListener(async function () {
  const tabs = await chrome.tabs.query({})
  for (const tab of tabs) {
    injectCapture(tab.id, true)
  }
})

const host = new MessageHost()
chrome.alarms.onAlarm.addListener(function (alarm) {
  if (alarm.name === 'keep-alive') {
    console.log('活跃状态')
  }
})

chrome.alarms.create('keep-alive', {
  periodInMinutes: 5
})
const init = () => {
  host.createSocket()
  chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    const request = req
    console.log(req)
    if (request.directive === 'clickByXpath') {
      const { tabId } = req
      backgroundService.toNextTabId = tabId
      setTimeout(async () => {
        const tabs = await chrome.tabs.query({ active: true })
        host.sendMessage({ directive: request.directive, res: { url: tabs[0].url } })
        backgroundService.nextPageUrl = ''
        backgroundService.toNextTabId = null
      }, 1000)
    } else {
      host.sendMessage(req)
    }
    return true
  })

  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (backgroundService.toNextTabId && tabId === backgroundService.toNextTabId) {
      backgroundService.nextPageUrl = changeInfo.url
    }
  })
}

init()
