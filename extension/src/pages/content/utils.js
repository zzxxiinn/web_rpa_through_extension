import { sendMessage } from '../utils'
// eslint-disable-next-line no-unused-vars
const hotKeyStack = []
const removeMask = () => {
  const mask = document.getElementById('cover-mask')
  if (mask) {
    document.body.removeChild(mask)
  }
}
const hotKeyUp = (e) => {
  console.log(e)
}
const hotKeyDown = (e) => {
  console.log(e)
}
const addHotKeyEvent = () => {
  document.addEventListener('keyup', hotKeyUp)
  document.addEventListener('keydown', hotKeyDown)
}
const removerHotKeyEvent = () => {
  document.removeEventListener('keydown', hotKeyDown)
  document.removeEventListener('keyup', hotKeyUp)
}

// eslint-disable-next-line no-unused-vars
const coverElement = null

function removeAllStyle (labels) {
  removerHotKeyEvent()
  console.log(labels[0].onmouseover)
  for (const label of labels) {
    label.style.border = ''
    label.onmouseover = null
    label.onclick = label.clickEvent
  }
}

function getXpath (element) {
  if (!element) {
    return ''
  }
  const attrs = element.attributes
  const tagname = element.tagName.toLowerCase()
  if (tagname === 'body') {
    return '/html/' + tagname
  }
  for (const attr of attrs) {
    if (attr.nodeName === 'id' && tagname !== 'a') {
      return '//' + tagname + '[@id="' + attr.nodeValue + '"]'
    }
  }
  let ix = 1
  let num = 0
  const siblings = element.parentNode.children
  for (const subElement of siblings) {
    if (subElement.nodeType === 1 && subElement.tagName === element.tagName) {
      num++
      if (num >= 3) {
        for (const attr of attrs) {
          if (attr.nodeName === 'class') {
            return getXpath(element.parentElement) + '/' + tagname + '[@class="' + attr.nodeValue + '"]'
          }
        }
        return getXpath(element.parentElement) + '/' + tagname
      }
    }
  }
  for (const subElement of siblings) {
    if (subElement === element) {
      if (siblings.length === 1) {
        return getXpath(element.parentElement) + '/' + tagname
      }
      return getXpath(element.parentElement) + '/' + tagname + '[' + (ix) + ']'
    } else if (subElement.nodeType === 1 && subElement.tagName === element.tagName) {
      ix++
    }
  }
}

const wrapperClickEvent = (label) => {
  function newCallBack (e) {
    const xpath = getXpath(e.target)
    e.preventDefault()
    e.stopPropagation()
    sendMessage({ directive: 'getXpath', res: { xpath: xpath, url: window.location.href } })
  }
  label.onclick = newCallBack
}

const getDomListByXpath = (xpath) => {
  const nodes = []
  try {
    const xresult = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null)
    let res = xresult.iterateNext()
    while (res) {
      nodes.push(res)
      res = xresult.iterateNext()
    }
  } catch (e) {
    console.error(e)
  }
  return nodes
}

const getContextByXpath = (xpath) => {
  const textList = []
  try {
    const nodes = getDomListByXpath(xpath)
    for (const node of nodes) {
      textList.push(node.innerText)
    }
  } catch (e) {
  }
  return textList
}
function clickNode (node) {
  node.click()
}
const clickByXpath = (xpath, isSingle = true) => {
  const nodes = getDomListByXpath(xpath)
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
const getDomListBySelector = (selector) => {
  const nodes = document.querySelectorAll(selector)
  return nodes
}
const clickBySelector = (selector, isSingle = true) => {
  const nodes = getDomListByXpath(selector)
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

const getIsCapture = () => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.sync.get(['isOpen'], function (result) {
        console.log('Value currently is ' + result.isOpen)
        resolve(result.isOpen || false)
      })
    } catch (e) {
      reject(e)
    }
  })
}

// eslint-disable-next-line no-unused-vars
const addHoverCoverStyle = (e) => {
  removeMask()
  const boundingRect = e.getBoundingClientRect()
  const coverDiv = document.createElement('div')
  coverDiv.id = 'cover-mask'
  const width = boundingRect.width
  const height = boundingRect.height
  const left = boundingRect.left + document.documentElement.scrollLeft - 1
  const top = boundingRect.top + document.documentElement.scrollTop - 1
  coverDiv.style.width = `${width}px`
  coverDiv.style.height = `${height}px`
  coverDiv.style.left = left + 'px'
  coverDiv.style.top = top + 'px'
  document.body.appendChild(coverDiv)
}

function addCaptureEvent (labels) {
  addHotKeyEvent()
  // const activeElementId = ''
  // const xpath = ''
  for (const label of labels) {
    label.onmouseover = function (e) {
      e.preventDefault()
      e.stopPropagation()
      addHoverCoverStyle(label)
    }
    wrapperClickEvent(label)
  }
}
export default {
  addHoverCoverStyle,
  addCaptureEvent,
  clickByXpath,
  getContextByXpath,
  getDomListByXpath,
  sendMessage,
  wrapperClickEvent,
  getXpath,
  removeAllStyle,
  getIsCapture,
  removeMask,
  addHotKeyEvent,
  removerHotKeyEvent,
  clickBySelector,
  getDomListBySelector
}
