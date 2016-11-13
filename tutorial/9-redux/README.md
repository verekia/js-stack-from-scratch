# 9 - Redux

В этой части (которая наиболее сложная из пройденных), мы добавим в наше приложение [Redux](http://redux.js.org/) ([документация на Русском](https://www.gitbook.com/book/rajdee/redux-in-russian/details)) и подключим его к React. Redux управляет состоянием приложения. Он включает в себя такие понятия, как:  

- **хранилище** (store) - простой JavaScript объект, представляющий состояние вашего приложения;
- **действия** (actions), которые обычно запускаются пользователем;
- **редюсеры** (reducers),которые можно рассматривать как обработчики действий.

Редюсеры воздествуют на состояние приложения (**хранилище**), и когда состояние приложения изменяется, что-то происходит в вашем приложении. Хорошая визуальная демонстрация Redux находится [здесь](http://slides.com/jenyaterpil/redux-from-twitter-hype-to-production#/9).

Для того, чтобы продемонстрировать использование Redux наиболее доступным способом, наше приложение будет состоять из сообщения и кнопки. Сообщение будет показывать лает собака или нет (изначально - нет), а кнопка будет заставлять ее лаять, что должно будет отражаться в сообщении.

В этой части нам потребуется два пакета: `redux` и `react-redux`.

- Запустите `yarn add redux react-redux`.

Давайте начнем с создания двух папок: `src/client/actions` и `src/client/reducers`.

- В `actions`, создайте `dog-actions.js`:

```javascript
export const MAKE_BARK = 'MAKE_BARK';

export const makeBark = () => ({
  type: MAKE_BARK,
  payload: true,
});
```

Тут мы определяем тип действия - `MAKE_BARK`, и функцию `makeBark` (именуемую *генератор действий*), которая запускает действие `MAKE_BARK`. Мы их экспортируем т.к. они нам понадобятся в других файлах. Это действие построено на основе модели [Flux Standard Action](https://github.com/acdlite/flux-standard-action), вот почему оно имеет атрибуты `type` и `payload`.

- В `reducers`, создайте `dog-reducer.js`:

```javascript
import { MAKE_BARK } from '../actions/dog-actions';

const initialState = {
  hasBarked: false,
};

const dogReducer = (state = initialState, action) => {
  switch (action.type) {
    case MAKE_BARK:
      return { hasBarked: action.payload };
    default:
      return state;
  }
};

export default dogReducer;
```

Здесь мы определили исходное состояние приложения, являющееся объектом, содержащим свойство `hasBarked`, установленное в `false`, и `dogReducer` - функцию, ответсвенную за перемену состояния, в зависимости от того, какое действие произошло. Состояние не может быть изменено в этой функции, но должен быть возвращен совершенно новый объект состояния.

- Изменим `app.jsx`, чтобы создать *хранилище*. Можете заменить весь файл следующим содержимым:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import dogReducer from './reducers/dog-reducer';
import BarkMessage from './containers/bark-message';
import BarkButton from './containers/bark-button';

const store = createStore(combineReducers({
  dog: dogReducer,
}));

ReactDOM.render(
  <Provider store={store}>
    <div>
      <BarkMessage />
      <BarkButton />
    </div>
  </Provider>
  , document.querySelector('.app')
);
```

Наше хранилище создано функцией Redux `createStore`, вполне наглядно. Объект хранилища собирается путем комбинирования всех редюсеров (в нашем случае одного) с помощью функции Redux `combineReducers`. Каждый редюсер в ней имеет имя, наш назовем `dog`.

Мы сделали достаточно, в части, относящейся к чистому Redux.

Теперь мы подключим Redux к React, используя пакет `react-redux`. Для того, чтобы `react-redux`, мог передать хранилище в наше приложение на React, нам нужно обернуть все приложение в компонент `<Provider>`. Этот компонент должен содержать единственный дочерний элемент, так что мы добавли `<div>`, и этот `<div>` содержит два основных элемента нашего приложения: `BarkMessage` и `BarkButton`.

Как вы могли заметить, в разделе `import`, мы импортируем `BarkMessage` and `BarkButton` из директории `containers`. Сейчас самое время представить концепцию **Компонентов** и **Контейнеров**.

*Компоненты* - это *"глупые"* компоненты React, в том смысле, что они ничего не знают о состоянии Redux. *Контейнеры* - *"умные"*, знают о состоянии и о том, что мы собираемся *подключиться* (*connect*) к "глупым" компонентам.

- Создайте 2 папки, `src/client/components` и `src/client/containers`.

- В `components` создайте следующие файлы:

**button.jsx**

```javascript
import React, { PropTypes } from 'react';

const Button = ({ action, actionLabel }) => <button onClick={action}>{actionLabel}</button>;

Button.propTypes = {
  action: PropTypes.func.isRequired,
  actionLabel: PropTypes.string.isRequired,
};

export default Button;
```

и **message.jsx**:

```javascript
import React, { PropTypes } from 'react';

const Message = ({ message }) => <div>{message}</div>;

Message.propTypes = {
  message: PropTypes.string.isRequired,
};

export default Message;

```

Это примеры *"глупых"* компонентов. Они практически лишены логики и просто оборажают то, что потребуется, путем передачи им **свойств** (props) React. Основное отличие `button.jsx` от `message.jsx`, в том, что последний содержит **действие** в качестве одного из параметров. Это действие срабатывет по событию `onClick`. В контексте нашего приложения, надпись `Button` никогда не будет изменяться, однако, компонент `Message`  должен отражать состояние нашего приложения и будет изменяться на основе этого.

Опять же, *компоненты* ничего не знают о Redux **действиях** или о **состоянии** нашего приложения. Вот почему мы собираемся создать "умные" **контейнеры** которые "подведут" нужные *действия* и *данные* к этим двум "глупым" компонентам. 

- В `containers`, создайте следующие файлы:

**bark-button.js**

```javascript
import { connect } from 'react-redux';
import Button from '../components/button';
import { makeBark } from '../actions/dog-actions';

const mapDispatchToProps = dispatch => ({
  action: () => { dispatch(makeBark()); },
  actionLabel: 'Bark',
});

export default connect(null, mapDispatchToProps)(Button);
```

и **bark-message.js**:

```javascript
import { connect } from 'react-redux';
import Message from '../components/message';

const mapStateToProps = state => ({
  message: state.dog.hasBarked ? 'The dog barked' : 'The dog did not bark',
});

export default connect(mapStateToProps)(Message);
```

`BarkButton` подключает действие `makeBark` и метод Redux `dispatch` к `Button`. А `BarkMessage` подключает `Message` к состоянию приложения. Когда состояние изменится, `Message` автоматически перегенерируется с нужным значением свойства `message`. Эти подключения выполнены через функцию `connect` пакета `react-redux`.

- Теперь можете запустить `yarn start` и открыть `index.html`. Вы должны увидеть надпись "The dog did not bark" и кнопку. Когда вы нажмете на кнопку, сообщение должно измениться на "The dog barked".

Следующий раздел: [10 - Immutable JS and Redux Improvements](/tutorial/10-immutable-redux-improvements)

<<<<<<< HEAD
Назад в [предыдущий раздел](/tutorial/8-react) или [Содержание](/../../).
=======
Назад в [предыдущий раздел](/tutorial/8-react) или [Содержание](/../../#Содержание).
>>>>>>> e923dbc5abecc22fea32add1421c59678ff2ebf1
