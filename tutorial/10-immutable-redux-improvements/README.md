# 10 - Immutable JS и улучшения Redux

## Immutable JS

В отличие от предыдущей части, эта довольно простая и состоит из незначительных улучшений.

Сначала мы добавим **Immutable JS** в наш проект. Immutable - это библиотека, позволяющая манипулировать объектами, не изменяя их. Вместо:

```javascript
const obj = { a: 1 };
obj.a = 2; // Изменяет `obj`
```
Мы можем сделать так:
```javascript
const obj = Immutable.Map({ a: 1 });
obj.set('a', 2); // Возвращает новый объект не изменяя `obj`
```

Такой подход соответствует парадигме **функционального программирования**, которая хорошо подходит для работы с Redux. Ваши reducer-функции вообщето **должны** быть чистыми и не изменять состояние хранилища (переданного в качестве параметра), а вместо этого возвращать абсолютно новое. Давайте воспользуемся Immutable чтобы достичь этого.

- Запустите `yarn add immutable`

Мы будем использовать имя `Map` в нашем проекте, но ESLint и конфигурация Airbnb начнут жаловаться на использование capitalized (где первая буква заглавная) имен, если это не имя класса. Добавьте следующее в `package.json` после `eslintConfig`:

```json
"rules": {
  "new-cap": [
    2,
    {
      "capIsNewExceptions": [
        "Map",
        "List"
      ]
    }
  ]
}
```
Таким образом мы внесли `Map` и `List` (два Immutable объекта, которые мы будем использовать постояно) в исключения к этому ESLint правилу. Такой подробный стиль форматирования JSON, выполняется автоматически Yarn/NPM, так что мы, к сожалению, не можем сделать его более компактным.

В любом случае, вернемся к Immutable:

Настройте `dog-reducer.js`, чтобы он выглядел так:

```javascript
import Immutable from 'immutable';
import { MAKE_BARK } from '../actions/dog-actions';

const initialState = Immutable.Map({
  hasBarked: false,
});

const dogReducer = (state = initialState, action) => {
  switch (action.type) {
    case MAKE_BARK:
      return state.set('hasBarked', action.payload);
    default:
      return state;
  }
};

export default dogReducer;
```

Теперь мы создаем исходное состояние, используя Immutable Map, а новое состояние получаем применяя `set()`, что исключает любые мутации предыдущего состояния.

В `containers/bark-message.js`, обновите функцию `mapStateToProps`, чтобы она использовала `.get('hasBarked')` вместо `.hasBarked`:

```javascript
const mapStateToProps = state => ({
  message: state.dog.get('hasBarked') ? 'The dog barked' : 'The dog did not bark',
});
```

Приложение должно вести себя точно так же, как и до этого.

**Примечание**: Если Babel жалуется на то, что Immutable превышает 100KB, добавьте `"compact": false` в `package.json` после `babel`.

Как вы можете видеть из предыдущего фрагмента кода, сам объект state все еще содержит старый атрибут `dog`, являющийся простым объектом и подверженный мутациям. В нашем случае это нормально, но если вы хотите манипулировать только немутируемыми объектами, можете установить пакет `redux-immutable`, чтобы заменить функцию `combineReducers` у Redux.

**Не обязательно**:
- Запустите `yarn add redux-immutable`
- Замените функцию `combineReducers` из `app.jsx` на ту, что мы импортировали из `redux-immutable`.
- В `bark-message.js` замените `state.dog.get('hasBarked')` на `state.getIn(['dog', 'hasBarked'])`.

## Redux Действя (Actions)

По мере того, как вы добавляете все больше и больше действий в ваше приложение, вы обнаружите, что приходится писать довольно много одного и того же кода. Пакет `redux-actions` помогает уменьшить этот повторяющийся код. С помощью `redux-actions` вы можете привести файл `dog-actions.js` к более компактному виду:

```javascript
import { createAction } from 'redux-actions';

export const MAKE_BARK = 'MAKE_BARK';
export const makeBark = createAction(MAKE_BARK, () => true);
```

`redux-actions` основывается на молели [Flux Standard Action](https://github.com/acdlite/flux-standard-action),так же, как и действия, которые мы создавали до этого, так что интеграция `redux-actions` будет бесшовной, если вы придерживаетесь этой модели.

- Не забудьте запустить `yarn add redux-actions`.

Следующий раздел: [11 - Тестировние с Mocha, Chai, и Sinon](/tutorial/11-testing-mocha-chai-sinon)

Назад в [предыдущий раздел](/tutorial/9-redux) или [Содержание](/../../).

