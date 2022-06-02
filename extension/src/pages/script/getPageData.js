
import _ from 'lodash'
import { sendMessage, getDomListByXpath } from '../utils'

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

function init () {
  const query = window.executeParams
  let rowLength = 0
  const res = []
  const dataSource = []
  for (const column of _.get(query, ['columns'], [])) {
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
  sendMessage({ directive: query.directive, res: { dataSource, tabId: query.tabId, url: window.location.href } })
}
init()
