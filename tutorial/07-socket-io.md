# 07 - Socket.IO

Kod dla tego rozdziału dostępny jest [tutaj](https://github.com/verekia/js-stack-walkthrough/tree/master/07-socket-io).

> 💡 **[Socket.IO](https://github.com/socketio/socket.io)** to biblioteka do łatwego radzenia sobie z Websockets. Zapewnia wygodny interfejs API i fallback dla przeglądarek, które nie obsługują Websockets.

W tym rozdziale zamierzamy skonfigurować podstawową wymianę komunikatów między klientem a serwerem. Aby nie dodawać więcej stron i komponentów - które nie byłyby związane z podstawową funkcją, która nas interesuje - zamierzamy umożliwić tę wymianę w konsoli przeglądarki. Brak elementów interfejsu użytkownika w tym rozdziale.

- Uruchom `yarn add socket.io socket.io-client`

## Server-side

- Edytuj swój `src/server/index.js` w taki sposób:

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

Pamiętaj, że aby Socket.IO działało, musisz użyć `Server` z `http` do `listen` dla przychodzących requestów, i nie Express `app`. Na szczęście nie zmienia to wiele kodu. Wszystkie szczegóły Websocket są uzewnętrznione w innym pliku, nazywanym `setUpSocket`.

- Dodaj następujące zmienne stałe do `src/shared/config.js`:

```js
export const IO_CONNECT = 'connect'
export const IO_DISCONNECT = 'disconnect'
export const IO_CLIENT_HELLO = 'IO_CLIENT_HELLO'
export const IO_CLIENT_JOIN_ROOM = 'IO_CLIENT_JOIN_ROOM'
export const IO_SERVER_HELLO = 'IO_SERVER_HELLO'
```

To są *rodzaje wiadomości*, które wymienia Twój klient i serwer. Proponuję poprzedzić je jednym z nich `IO_CLIENT` lub `IO_SERVER`, aby było jaśniej *kto* wysyła wiadomość. W przeciwnym razie sprawy mogą stać się dość mylące, gdy masz wiele typów wiadomości.

Jak możesz zauważyć, mamy `IO_CLIENT_JOIN_ROOM`, ponieważ ze względu na demonstrację sprawimy, że klienci dołączą do pokoju (np. pokoju rozmów). Pokoje są przydatne do nadawania wiadomości dla określonych grup użytkowników.

- Stwórz plik `src/server/socket.js` zawierający:

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

Okej, więc w tym pliku implementujemy *jak powinien reagować nasz serwer, gdy klienci łączą się i wysyłają do niego wiadomości*:

- Kiedy klient się łączy, logujemy go w konsoli serwera i uzyskujemy dostęp do obiektu `socket`, za pomocą którego możemy się komunikować z tym klientem.
- Gdy klient wysyła `IO_CLIENT_JOIN_ROOM`, włączamy go do `pokoju`, który chce. Po dołączeniu do pokoju wysyłamy 3 wiadomości demo: 1 wiadomość do każdego użytkownika, 1 wiadomość do użytkowników w tym pokoju, 1 wiadomość tylko do tego klienta.
- Kiedy klient wysyła „IO_CLIENT_HELLO”, logujemy jego komunikat w konsoli serwera.
- Gdy klient się rozłącza, również go logujemy.

## Client-side

Po stronie klienta rzeczy będą wyglądać bardzo podobnie.

- Edytuj `src/client/index.jsx` w ten sposób:

```js
// [...]
import setUpSocket from './socket'

// [at the very end of the file]
setUpSocket(store)
```

Jak widać, przekazujemy Redux store do `setUpSocket`. W ten sposób, ilekroć wiadomość Websocket pochodząca z serwera powinna zmienić stan klienta Redux, możemy 'wysłać' akcje. Jednak w tym przykładzie nie zamierzamy 'wysyłać' niczego.

- Stwórz plik `src/client/socket.js` zawierający:

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

To, co się tutaj dzieje, nie powinno dziwić, jeśli dobrze zrozumiesz, co zrobiliśmy na serwerze:

- Gdy tylko klient zostanie podłączony, logujemy go w konsoli przeglądarki i dołączamy do pokoju `hello-1234` z komunikatem `IO_CLIENT_JOIN_ROOM`.
- Następnie wysyłamy komunikat 'Hello!' Z komunikatem 'IO_CLIENT_HELLO'.
- Jeśli serwer wyśle nam komunikat 'IO_SERVER_HELLO', logujemy go w konsoli przeglądarki.
- Rejestrujemy również wszelkie rozłączenia.

🏁 Uruchom `yarn start` i `yarn dev:wds`, otwórz `http://localhost:8000`. Następnie otwórz konsolę przeglądarki, a także spójrz na terminal serwera Express. Powinieneś zobaczyć komunikację Websocket między twoim klientem, a serwerem.

Następna sekcja: [08 - Bootstrap, JSS](08-bootstrap-jss.md#readme)

Powrót do [poprzedniej sekcji](06-react-router-ssr-helmet.md#readme) lub do [spisu treści](https://github.com/verekia/js-stack-from-scratch#table-of-contents).
