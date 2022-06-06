import { TabsApi } from '../../background/services/chromeApi'
const tabsApi = new TabsApi()
const open = async (data) => {
  const res = await chrome.tabs.create({
    url: data.url
  })
  return { url: res.pendingUrl, tabId: res.id }
}
const close = async (data) => {
  let tab = null
  const url = data.data.url
  const tabId = data.data.tabId
  if (url) {
    const tabs = await tabsApi.query({ url: data.data.url })
    tab = tabs[0]
  } else if (tabId) {
    tab = tabsApi.get(tabId)
  }
  if (tab) {
    const res = await tabsApi.remove([tab.id])
    return { url: res.url, tabId: tabId }
  }
  throw new Error('未找到网页对象')
}
const closeAll = async (data) => {
  const res = await tabsApi.create({
    url: data.url
  })
  return { directive: 'browser.open', res: { url: res.pendingUrl, tabId: res.id } }
}
export default {
  open,
  close,
  closeAll
}
