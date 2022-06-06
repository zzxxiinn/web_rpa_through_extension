import { sendMessageToTab, injectCapture } from '../../utils'
import { TabsApi, StorageApi } from './chromeApi'

export class BackgroundService {
  constructor () {
    this.isOpen = false
    this.toNextTabId = null
    this.nextPageUrl = ''
  }

  setOpen = async function (isOpen) {
    await new StorageApi().set({ isOpen })
    const tabs = await (new TabsApi().query({}))
    console.log(tabs)
    for (const tab of tabs) {
      injectCapture(tab.id)
      sendMessageToTab(tab.id, { isOpen: isOpen })
    }
    this.isOpen = isOpen
  }
}
