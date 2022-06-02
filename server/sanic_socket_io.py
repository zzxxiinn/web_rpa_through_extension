from sanic import Sanic

from tools import Singleton


class Server:
    def __init__(self, app: Sanic):
        self.app = app
        self.debug = True
        self.local = True

    def setup(self):
        self._setup_socket_server()

    def _setup_socket_server(self):
        ...


class SocketServer(metaclass=Singleton):
    ...


if __name__ == '__main__':
    app = Sanic('')
    server = Server(app)
    server.setup()
