export class MessageHost {
  constructor (wsServer) {
    this.websocket = null
    this.wsServer = wsServer || 'ws://localhost:3058/action'
    this.handleOpen = (evt) => {
//      this.websocket.send('hello')
      console.log('on_open: ', evt)
    }
    this.handleMessage = (data) => {
      console.log(data)
    }
  }

  connect () {
    if (this.websocket) {
      this.disconnect()
    }
    this.websocket = new WebSocket(this.wsServer)
    this.websocket.onopen = (evt) => {
      this.handleOpen(evt)
    }
    this.websocket.onclose = (evt) => {
      this.reconnect()
    }
    this.websocket.onmessage = async (evt) => {
      let data = evt.data || {}
      try {
        data = JSON.parse(data)
      } catch (e) {
        console.log(e)
      }
      this.handleMessage(data)
    }
    this.websocket.onerror = (evt) => {
      this.reconnect()
    }
  }

  onopen (handle) {
    this.handleOpen = handle
  }

  onmessage (handle) {
    this.handleMessage = handle
  }

  disconnect () {
    this.websocket.close()
    this.websocket = null
  }

  reconnect () {
    if (this.timer) {
      return
    }
    this.timer = setTimeout(() => {
      this.connect()
      this.timer = null
    }, 1000)
  }

  send (message) {
    if (typeof (message) === 'string') {
      this.websocket.send(message)
    } else {
      this.websocket.send(JSON.stringify(message))
    }
  }
}
