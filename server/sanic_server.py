import json
from asyncio import Queue

from sanic import Sanic, text, Request

from web_module import open_page

task_map = {
    'openPage': open_page
}

app = Sanic("MyHelloWorldApp")


@app.listener('after_server_start')
def create_task_queue(app, loop):
    app.ctx.task_queue = Queue(loop=loop, maxsize=10)
    app.ctx.task_result_queue = Queue(loop=loop, maxsize=10)


async def run_task(data):
    task_queue = app.ctx.task_queue
    task_result_queue = app.ctx.task_result_queue

    task_queue.put_nowait(data)
    result = await task_result_queue.get()
    return result


@app.get("/")
async def hello_world(request):
    task_result = await run_task({"directive": "openPage", "data": {"url": "http://www.baidu.com"}})
    return text(json.dumps(task_result))


@app.websocket("/action")
async def feed(request: Request, ws):
    while True:
        try:
            task_data = await request.app.ctx.task_queue.get()
            task_result = await task_map[task_data['directive']](ws, task_data['data'])
            request.app.ctx.task_result_queue.put_nowait(task_result)
        except Exception as e:
            print(e)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3058)
