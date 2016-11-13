# 8 - React

Теперь мы начнем генерировать наше приложение с помощью React.

Сначала установим React и ReactDOM:

- запустите `yarn add react react-dom`

Эти два пакета будут включены в раздел `"dependencies"`, а не `"devDependencies"`, потому что, в отличие от инструментов разработки, они должны быть в итоговой клиентской сборке (production).

Давайте переименуем файл `src/client/app.js` в `src/client/app.jsx` и напишем в нем немного кода на React и JSX:

```javascript
import 'babel-polyfill';

import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Dog from '../shared/dog';

const dogBark = new Dog('Browser Toby').bark();

const App = props => (
  <div>
    The dog says: {props.message}
  </div>
);

App.propTypes = {
  message: PropTypes.string.isRequired,
};

ReactDOM.render(<App message={dogBark} />, document.querySelector('.app'));
```

**Примечание**: Если вы не знакомы с React или его PropTypes (типы параметров), ознакомьтесь сначала с ним и затем возвращайтесь в это руководство. В следующих главах мы будем использовать React, поэтому вам понадобится хорошее его понимание.

В Gulp файле, измените в `clientEntryPoint` расширение на `.jsx`:

```javascript
clientEntryPoint: 'src/client/app.jsx',
```

Поскольку мы используем синтаксис JSX, нам так же нужен Babel для его обработки.
Установите React Babel preset, который научит Babel обрабатывать JSX синтаксис
`yarn add --dev babel-preset-react`, и откорректируйте раздел `babel` в `package.json` следующим образом:

```json
"babel": {
  "presets": [
    "latest",
    "react"
  ]
},
```

Теперь, после запуска `yarn start`, открыв `index.html`, мы должны увидеть "The dog says: Wah wah, I am Browser Toby", сгенерированное React.

Следующий раздел: [9 - Redux](/tutorial/9-redux)

Назад в [предыдущий раздел](/tutorial/7-client-webpack) или [Содержание](/../../#Содержание).
