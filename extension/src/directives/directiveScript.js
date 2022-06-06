import clickElement from './element/clickElement'
import setInputValue from './element/setInputValue'
import getPageData from './element/getPageData'
(function () {
  // if (window.injected) {
  //   return
  // }
  // window.injected = true
  window.directiveMethods = {
    clickElement: clickElement,
    setInputValue: setInputValue,
    getPageData: getPageData
  }
  console.log('injected')
})()
