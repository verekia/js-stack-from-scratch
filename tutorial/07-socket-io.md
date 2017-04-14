# 07 - Socket.IO

Кода за тази глава можете да намерите [тук](https://github.com/verekia/js-stack-walkthrough/tree/master/07-socket-io).

> 💡 **[Socket.IO](https://github.com/socketio/socket.io)** е библиотека за работа с Websockets. Предоставя удобно API и има резервен вариант за браузъри, които не поддържат Websockets.

В тази глава ще направим простичък обмен на съобщения между клиента и сървъра. За да не се налага добавянето на нови страници и компоненти, което не е нещо релевантно за тази тази глава, ще направим този обмен да се случва в конзолата на браузъра. В тази глава няма да има неща свързани с потребителския интерфейс.

- Изпълнете `yarn add socket.io socket.io-client`

## Server-side

- Редактирайте `src/server/index.js` файла, както следва:

```js
// @flow

import compression from 'compression'
import express from 'express'
import { Server } from 'http'
import socketIO from 'socket.io'

import routing from './routing'
import { WEB_PORT, STATIC_PATH } from '../shared/config'
import { isProd } from '../shared/util'
import setUpSocket from './socket'

const app = express()
// flow-disable-next-line
const http = Server(app)
const io = socketIO(http)
setUpSocket(io)

app.use(compression())
app.use(STATIC_PATH, express.static('dist'))
app.use(STATIC_PATH, express.static('public'))

routing(app)

http.listen(WEB_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${WEB_PORT} ${isProd ? '(production)' :
    '(development).\nKeep "yarn dev:wds" running in an other terminal'}.`)
})
```

Забележете, ча за да може Socket.IO да работи трябва да използвате `Server` от `http` да `слуша` за идващите заявки, а не Express `app`. За щастие, това не променя много кода ни. Всички детайли отнасящи се до Websocket са отделени в отделен файл, наречен `setUpSocket`.

- Добавете следните константи в `src/shared/config.js`:

```js
export const IO_CONNECT = 'connect'
export const IO_DISCONNECT = 'disconnect'
export const IO_CLIENT_HELLO = 'IO_CLIENT_HELLO'
export const IO_CLIENT_JOIN_ROOM = 'IO_CLIENT_JOIN_ROOM'
export const IO_SERVER_HELLO = 'IO_SERVER_HELLO'
```

Това са *типовете съобщения*, които вашия клиент и сървър ще обменят. Препоръчвам ви да им добавите префикс, който ще направи по-лесно разпознаването на това кой изпраща и кой получава съобщението. Можете да използвате например `IO_CLIENT` или `IO_SERVER`. В противен случай, нещата могат да станат доста объркващи когато съобщенията станат прекалено много.

Както може би сте видели, имаме и `IO_CLIENT_JOIN_ROOM`, тъй като в името на по-добрата демонстрация, ще направим така че клиентите да могат да се присъединяват в стая (например чат стая). Стаите се използват за изпращане на съобщения до определена група от потребители.

- Създайте `src/server/socket.js` файл, съдържащ:

```js
// @flow

import {
  IO_CONNECT,
  IO_DISCONNECT,
  IO_CLIENT_JOIN_ROOM,
  IO_CLIENT_HELLO,
  IO_SERVER_HELLO,
} from '../shared/config'

/* eslint-disable no-console */
const setUpSocket = (io: Object) => {
  io.on(IO_CONNECT, (socket) => {
    console.log('[socket.io] A client connected.')

    socket.on(IO_CLIENT_JOIN_ROOM, (room) => {
      socket.join(room)
      console.log(`[socket.io] A client joined room ${room}.`)

      io.emit(IO_SERVER_HELLO, 'Hello everyone!')
      io.to(room).emit(IO_SERVER_HELLO, `Hello clients of room ${room}!`)
      socket.emit(IO_SERVER_HELLO, 'Hello you!')
    })

    socket.on(IO_CLIENT_HELLO, (clientMessage) => {
      console.log(`[socket.io] Client: ${clientMessage}`)
    })

    socket.on(IO_DISCONNECT, () => {
      console.log('[socket.io] A client disconnected.')
    })
  })
}
/* eslint-enable no-console */

export default setUpSocket
```

Oк, в този файл имплементираме *как нашия сървър трябва да реагира когато клиент се свърже с него и му изпрати съобщение*:

- Когато клиент се свърже, ние го записваме в сървърната конзола и получаваме достъп до `socket` обекта, чрез който можем да комуникираме с този клиент.
- Когато клиент изпрати `IO_CLIENT_JOIN_ROOM`, ние го присъединяваме към `стаята`, която иска. След като се присъедини в стая, ние изпращаме 3 демо съобщения: 1 съобщение към всички потребители, 1 съобщение към потребителите в тази стая, 1 съобщение само към клиента.
- Когато клиент изпрати `IO_CLIENT_HELLO`, ние записваме неговото съобщение в сървърната конзола.
- Записваме, също така, когато клиентът се отпише.

## Клиент (Client-side)

Клиентската част на нещата ще изглежда доста подобно.

- Редактирайте `src/client/index.jsx` файла, както следва:

```js
// [...]
import setUpSocket from './socket'

// [at the very end of the file]
setUpSocket(store)
```

Както можете да видите, подаваме Redux store обекта на `setUpSocket`. По този начин всеки път когато пристигне Websocket съобщение от сървъра ще трябва да се запише в клиентския Redux state обект и ще знаем, че трябва да изпратим действия (`dispatch` actions). Но в този пример няма да се занимаваме с това.

- Създайте `src/client/socket.js` файл, съдържащ:

```js
// @flow

import socketIOClient from 'socket.io-client'

import {
  IO_CONNECT,
  IO_DISCONNECT,
  IO_CLIENT_HELLO,
  IO_CLIENT_JOIN_ROOM,
  IO_SERVER_HELLO,
  } from '../shared/config'

const socket = socketIOClient(window.location.host)

/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars
const setUpSocket = (store: Object) => {
  socket.on(IO_CONNECT, () => {
    console.log('[socket.io] Connected.')
    socket.emit(IO_CLIENT_JOIN_ROOM, 'hello-1234')
    socket.emit(IO_CLIENT_HELLO, 'Hello!')
  })

  socket.on(IO_SERVER_HELLO, (serverMessage) => {
    console.log(`[socket.io] Server: ${serverMessage}`)
  })

  socket.on(IO_DISCONNECT, () => {
    console.log('[socket.io] Disconnected.')
  })
}
/* eslint-enable no-console */

export default setUpSocket
```

Ако сте разбрали какво направихме от страна на сървъра значи това, което се случва тук не би трябвало да ви изненадва:

- Веднага след като клиентът се свърже, го записваме в конзолата на браузъра и го присъединяваме към стая `hello-1234` чрез `IO_CLIENT_JOIN_ROOM` съобщението.
- След това изпращаме `Hello!` с `IO_CLIENT_HELLO` съобщението.
- Ако сървърът ни изпрати `IO_SERVER_HELLO` съобщение, го записваме в конзолата на браузъра.
- Също така записваме когато връзката прекъсне.

🏁 Изпълнете `yarn start` и `yarn dev:wds`, отворете `http://localhost:8000`. След това отворете конзолата на браузъра ви и също така гледайте в терминала на вашия Express сървър. Би трябвало да видите Websocket комуникацията между клиента и сървъра.

Следваща глава: [08 - Bootstrap, JSS](08-bootstrap-jss.md#readme)

Назад към [предишната глава](06-react-router-ssr-helmet.md#readme) или към [съдържанието](https://github.com/mihailgaberov/js-stack-from-scratch#Съдържание).