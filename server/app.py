import json
from asyncio import Queue

from sanic import Sanic, text, Request

from server.utils.get_browser_path import open_browser
from web_module import open_page, click_by_xpath

task_map = {
    'openPage': open_page,
    'clickByXpath': click_by_xpath
}

SUCC = 'SUCCESS'
FAIL = 'FAILED'

app = Sanic("MyHelloWorldApp")


@app.listener('after_server_start')
def create_task_queue(_app, loop):
    _app.ctx.task_queue = Queue(loop=loop, maxsize=10)
    _app.ctx.task_result_queue = Queue(loop=loop, maxsize=10)


async def run_task(data):
    task_queue = app.ctx.task_queue
    task_result_queue = app.ctx.task_result_queue

    task_queue.put_nowait(data)
    result = await task_result_queue.get()

    try:
        result = json.loads(result)
        return SUCC, result
    except Exception as e:
        print(e)
        return FAIL, result


@app.websocket("/action")
async def feed(request: Request, ws):
    while True:
        try:
            task_data = await request.app.ctx.task_queue.get()
            task_result = await task_map[task_data['directive']](ws, task_data['data'])
            request.app.ctx.task_result_queue.put_nowait(task_result)
        except Exception as e:
            print(e)


@app.get("/")
async def hello_world(request):
    test_url = "https://www.baidu.com/"
    open_browser()
    status, task_result = await run_task({"directive": "openPage", "data": {"url": test_url}})
    if status == SUCC:
        # data: dict = task_result['res']
        data = {'url': test_url, 'xpath': '//*[@id="hotsearch-content-wrapper"]/li[1]/a'}
        status, task_result = await run_task({"directive": "clickByXpath", "data": data})

    return text(json.dumps(task_result))


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3058)
