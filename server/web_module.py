import json

task_list = [
    {"directive": "openPage", "data": {"url": ""}},
    {"directive": "closePage", "data": {"url": "", "tabId": ""}},
    {"directive": "setInputValue", "data": {"xpath": "", "tabId": "", "url": "", "value": ""}},
    {"directive": "clickByXpath", "data": {"url": "", "tabId": "", "xpath": "this.xpath"}}
]


async def open_page(ws, data):
    await ws.send(json.dumps({"directive": "openPage", "data": data}))
    result = await ws.recv()
    return result
