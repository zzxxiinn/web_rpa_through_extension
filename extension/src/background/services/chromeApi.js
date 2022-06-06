
export class StorageApi {
  set (params) {
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

  get (getList) {
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
}

export class TabsApi {
  async create (createProperties) {
    const tab = await chrome.tabs.create(createProperties)
    return tab
  }

  async query (queryInfo) {
    const tabs = await chrome.tabs.query(queryInfo)
    return tabs
  }

  async update (tabId, updateInfo) {
    return new Promise((resolve, reject) => {
      chrome.tabs.update(tabId, updateInfo, (tab) => {
        resolve(tab)
      })
    })
  }

  async get (tabId) {
    const tab = await chrome.tabs.get(tabId)
    return tab
  }

  reload (tabId, bypassCache) {
    return new Promise((resolve, reject) => {
      chrome.tabs.reload(tabId, {
        bypassCache: bypassCache
      }, () => {
        resolve()
      })
    })
  }

  goForward (tabId) {
    return new Promise((resolve, reject) => {
      chrome.tabs.goForward(tabId, () => {
        resolve()
      })
    })
  }

  goBack (tabId) {
    return new Promise((resolve, reject) => {
      chrome.tabs.goBack(tabId, () => {
        resolve()
      })
    })
  }

  remove (tabIds) {
    return new Promise((resolve, reject) => {
      chrome.tabs.remove(tabIds, () => {
        resolve()
      })
    })
  }

  getZoom (tabId) {
    return new Promise((resolve, reject) => {
      chrome.tabs.getZoom(tabId, (zoomFactor) => {
        resolve(zoomFactor)
      })
    })
  }

  async injectDirectiveScript (tabId) {
    return new Promise((resolve, reject) => {
      const frameId = 1
      chrome.scripting.executeScript({
        target: { tabId },
        func: function (params) {
          window.tabId = params.tabId
          window.frameId = params.frameId
          console.log('233333')
        },
        args: [{ frameId, tabId }]
      }, function () {
        chrome.scripting.executeScript({ target: { tabId }, files: ['js/directiveScript.js'] },
          function () {
            resolve(true)
          })
      })
    })
  }

  async executeDirective (tabId, name, params) {
    await this.injectDirectiveScript(tabId)
    return new Promise((resolve, reject) => {
      chrome.scripting.executeScript({
        target: { tabId },
        func: function (params, directiveName) {
          if (!window.directiveParams) {
            window.directiveParams = {}
          }
          const method = window.directiveMethods[directiveName]
          console.log(method, window.directiveMethods, directiveName, 'methods')
          if (method) {
            method(params)
          }
        },
        args: [params, name]
      })
    })
  }
}
