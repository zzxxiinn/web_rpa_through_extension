
import _ from 'lodash'
import { sendMessage, getDomListByXpath } from '../../utils'

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

export default function getPageData (params) {
  let rowLength = 0
  const res = []
  const dataSource = []
  for (const column of _.get(params, ['columns'], [])) {
    const contexts = getContextByXpath(column.xpath)
    rowLength = Math.max(contexts.length, rowLength)
    res.push({ ...column, contexts })
  }
  for (let i = 0; i < rowLength; i++) {
    const row = {}
    for (const column of res) {
      const { dataIndex, contexts } = column
      row[dataIndex] = contexts[i]
    }
    dataSource.push(row)
  }
  sendMessage({ directive: params.directive, res: { dataSource, frameId: window.frameId, tabId: window.tabId, url: window.location.href } })
}
