import { injectCapture, generatorDirective } from '../utils'
import { MessageHost } from './services/messageService'
import { BackgroundService } from './services/backgroundService'
const backgroundService = new BackgroundService()
const host = new MessageHost()

const onmessage = async (data) => {
  if (data.directive === 'select') {
    backgroundService.setOpen(true)
  } else if (data.directive === 'cancelSelect') {
    backgroundService.setOpen(false)
  } else if (data.directive === 'browser.open') {
    const res = await chrome.tabs.create({
      url: data.data.url
    })
    host.send({ directive: 'browser.open', res: { url: res.pendingUrl, tabId: res.id } })
  } else if (data.directive === 'browser.close') {
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
    host.send({ directive: 'browser.close', res: { url, tabIds } })
  } else if (data.directive) {
    console.log(data)
    const directive = generatorDirective(data.directive)
    directive(data.data)
  }
}

chrome.runtime.onInstalled.addListener(async function () {
  const tabs = await chrome.tabs.query({})
  for (const tab of tabs) {
    injectCapture(tab.id, true)
  }
})

host.onmessage(onmessage)

const init = () => {
  host.connect()
  chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    const request = req
    if (request.directive === 'clickElement') {
      const { tabId } = req
      backgroundService.toNextTabId = tabId
      setTimeout(async () => {
        const tabs = await chrome.tabs.query({ active: true })
        host.sendMessage({ directive: request.directive, res: { url: tabs[0].url } })
        backgroundService.nextPageUrl = ''
        backgroundService.toNextTabId = null
      }, 1000)
    } else {
      host.send(req)
    }
    return true
  })
}

init()

chrome.alarms.onAlarm.addListener(function (alarm) {
  if (alarm.name === 'keep-alive') {
    console.log('活跃状态')
  }
})

chrome.alarms.create('keep-alive', {
  periodInMinutes: 1
})
