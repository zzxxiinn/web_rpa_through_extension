import json

task_list = [
    {"directive": "openPage", "data": {"url": ""}},
    {"directive": "closePage", "data": {"url": "", "tabId": ""}},
    {"directive": "setInputValue", "data": {"xpath": "", "tabId": "", "url": "", "value": ""}},
    {"directive": "clickByXpath", "data": {"url": "", "tabId": "", "xpath": "this.xpath"}}
]


async def open_page(ws, url):
    await ws.send(json.dumps({"directive": "browser.open", "data": {"url": url}}))
    result = await ws.recv()
    return result


async def click_by_xpath(ws, url, tab_id, xpath):
    await ws.send(json.dumps({"directive": "clickElement", "data": {"url": url, "tabId": tab_id, "xpath": xpath}}))
    result = await ws.recv()
    return result


async def close_page(ws, url, tab_id):
    await ws.send(json.dumps({"directive": "browser.close", "data": {"url": url, "tabId": tab_id}}))
    result = await ws.recv()
    return result
