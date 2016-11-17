# 9 - Redux

ในบทนี้ (ซึ่งตะมีความยากเยอะมาก) เราจะเพิ่ม [Redux](http://redux.js.org/) เข้ามาใช้ในแอพของเรา แล้วเราจะใช้มันคู่กับ React

Redux นั้นเป็นคนที่จัดการเกี่ยวกับ state ของแอพเรา Redux จะมีสิ่งที่เรียกว่า **store** ที่เป็น JavaScript object​ ธรรมดา เพื่อบ่งบอกถึง state ของแอพ **actions** ที่ปกติจะถูกเรียกใช้โดย users และ **reducers** ที่สามารถมองเป็นคนที่จัดการ action ที่เกิดขึ้นก็ได้ โดย Reducers จะเป็นคนเปลี่ยนแปลง state ของแอพ (ซึ่งก็ถูกเก็บใน *store*) เมื่อ state มีการเปลี่ยนแปลงขึ้นมาแล้ว จะทำให้แอพ (หน้า view) เกิดการเปลี่ยนแปลงขึ้น

ตัวอย่างหลักการของ Redux แบบเข้าใจง่ายขึ้นนั้นสามารถดูได้[ที่นี่](http://slides.com/jenyaterpil/redux-from-twitter-hype-to-production#/9)

เพื่อที่จะสาธิตวิธีการใช้งาน Redux ให้ง่ายและ simple ที่สุดเท่าที่จะเป็นไปได้ แอพที่เราจะทำจะประกอบด้วย message กับ button message จะบอกว่าตอนนี้หมาของเรานั่นเห่าหรือไม่เห่า (ตอนเริ่มต้น หมาจะไม่เห่า) และ button นั้นจะเป็นการสั่งให้หมาเห่า ซึ่งทำให้ message ต้องมีการอัพเดต (บอกว่าหมาเห่า)

เราต้องการ package เพิ่มเติมสองตัวในบทนี้ `redux` และ `react-redux`

- สั่ง `yarn add redux react-redux`

เราเริ่มต้นโดยการสร้างโฟลเดอร์ขึ้นมาสองอัน `src/client/actions` และ `src/client/reducers`

- ในโฟลเดอร์ `actions` สร้างไฟล์ `dog-actions.js` ใน `dog-actions.js` เขียนโค้ดตามนี้

```javascript
export const MAKE_BARK = 'MAKE_BARK';

export const makeBark = () => ({
  type: MAKE_BARK,
  payload: true,
});
```

ในโค้ดนั้นเรามีการนิยาม action type `MAKE_BARK` และ function (หรืออีกชื่อหนึ่งคือ *action creator*) ชื่อ `makeBark` ที่จะเป็นคนไปเรียก action `MAKE_BARK` ทั้งคู่จะถูก export ออกไป เนื่องจากเราต้องการทั้งสองค่าในไฟล์อื่นๆ โดย action นั้นจะสร้าง [Flux Standard Action](https://github.com/acdlite/flux-standard-action) model ขึ้นมา โดยมีสอง attributes คือ `type` กับ `payload`

- ใน `reducers` สร้างไฟล์ `dog-reducer.js` ใน `dog-reducer.js` เขียนโค้ดตามนี้

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

ในนี้เราจะกำหนด state เริ่มต้นให้กับแอพเรา ซึ่งเป็น object ที่มี property `hasBarked` โดยให้เริ่มเป็น `false` (หมาไม่เห่า) และประกาศ `dogReducer` ให้เป็น function ที่มีหน้าที่ในการจัดการ state ตาม action ที่ได้รับมา ซึ่ง state นั้นจะไม่สามารถแก้ไขได้ตรงๆ ใน function แต่จะ return state object ก้อนใหม่ขึ้นมาแทน (สังเกตว่ามีการ `return { hasBarked: action.payload };` มาแทน)

- เราจะแก้ไข `app.jsx` เพื่อให้สร้าง *store* ขึ้นมา โดยเราสามารถเขียนไฟล์นี้ใหม่ได้โดยมีโค้ดตามนี้แทน

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

store ของเราจะถูกสร้างโดย Redux function `createStore` โดย store object นั้นจะรวม reducers ทุกตัวที่เรามี โดยใช้ function `combineReducers` ของ Redux (ในกรณีนี้เรามี reducer ตัวเดียว) reducer แต่ละตัวจะถูกตั้งชื่อที่นี่ โดยเราตั้งชื่อ reducer ของเราว่า `dog`

ซึ่งส่วนประกอบทั้งหมดก่อนหน้านี้ ถือว่าเป็น pure Redux ทั้งหมด ยังไม่มี React เลย เราต้้องผูกทั้งสองอย่างเข้าด้วยกัน โดยใช้ `react-redux` เพื่อให้ `react-redux` ทำการ pass store เข้าไปในแอพที่ใช้ React ของเรา ซึ่งแอพของเราทั้งหมดจะต้องโดน wrap ด้วย `<Provider>` component ที่ component นี้มี child component ได้แค่คนเดียวเท่านั้น ทำให้เราต้องสร้าง `<div>` ขึ้นมา และใน `<div>` นี้จะมี elements หลักของแอพเราสองอัน คือ `BarkMessage` และ `BarkButton`

ถ้าเราสังเกตดูในส่วนของ `import` จะพบว่า `BarkMessage` และ `BarkButton` ถูก import มาจากโฟลเดอร์ `containers` ตอนนี้ถึงเวลาแล้วที่เราจะอธิบาย concept ของ **Components** และ **Containers** แบบจริงๆ จังๆ สักที

*Components* นั้นเป็น *dumb* React components ธรรมดาๆ ซึ่ง เพราะ Components นั้นจะไม่รู้เรื่องเกี่ยวกับ Redux state เลยแม้แต่น้อย แต่กับ *Containers* นั้นจะกลับกัน Containers เป็น *smart* components ที่รู้จักเกี่ยวกับ state ของ Redux และตอนนี้เรากำลังจะทำ *เชื่อมต่อ* smart component ไปกับ dumb components ดังนี้

- สร้างโฟลเดอร์ 2 อัน `src/client/components` กับ `src/client/containers`

- ในโฟลเดอร์ `components` สร้างไฟล์ดังต่อไปนี้

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

และไฟล์ **message.jsx**:

```javascript
import React, { PropTypes } from 'react';

const Message = ({ message }) => <div>{message}</div>;

Message.propTypes = {
  message: PropTypes.string.isRequired,
};

export default Message;

```

ทั้งสองอันนี้เป็นตัวอย่างของ *dumb* components เราจะพบว่าทั้งคู่นั้นต่างไม่มี logic ใดๆ เลย มีหน้าที่เพียงแค่โชว์สิ่งที่มีคนขอให้โชว์ ผ่านสิ่งที่เรียกว่า **props** ใน React ข้อแตกต่างอย่างชัดเจนของ `button.jsx` กับ `message.jsx` นั้นคือ `Button` มี **action** ส่งมาใน props ของมัน ซึ่ง action ที่ถูกส่งมาจะผูกติดกับ event `onClick` ของปุ่ม นอกจากนี้ในมุมมองของแอพเรา เราจะพบว่า label ของ `Button` จะไม่ถูกเปลี่ยนแปลงเลย อย่างไรก็ตาม `Message` component นั้นจะเปลี่ยนค่าไปตาม state ของแอพเรา

ย้ำอีกครั้งว่า *components* จะไม่รู้อะไรเกี่ยวกับ Redux **actions** หรือ **state** ของแอพเรา นั่นทำให้เราต้องสร้าง smart **containers** ขึ้นมาครอบ เพื่อส่ง *actions* หรือ *data* ที่ถูกต้องไปให้กับ dumb components ทั้งสองตัว

- ในโฟลเดอร์ `containers` ให้สร้างไฟล์

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

และไฟล์ **bark-message.js**:

```javascript
import { connect } from 'react-redux';
import Message from '../components/message';

const mapStateToProps = state => ({
  message: state.dog.hasBarked ? 'The dog barked' : 'The dog did not bark',
});

export default connect(mapStateToProps)(Message);
```

`BarkButton` จะเชื่อมกับ `Button` โดยมี `makeBark` action และ `dispatch` method ของ Redux ส่วน `BarkMessage` จะเชื่อม state ของแอพกับ `Message` เมื่อ state เกิดการเปลี่ยนแปลง `Message` จะทำการ re-render component โดยอัตโนมัติ การเชื่อมต่อทั้งหมดนี้จะทำผ่าน function ชื่อว่า `connect` ของ `react-redux`

- ตอนนี้ลองสั่ง `yarn start` และเปิด `index.html` ขึ้นมา เราจะเห็นคำว่า "The dog did not bark" และมีปุ่มหนึ่งปุ่ม เมื่อคุณกดปุ่ม ข้อความควรจะเป็นคำว่า "The dog barked"

บทถัดไป [10 - Immutable JS and Redux Improvements](/tutorial/10-immutable-redux-improvements)

กลับไปยัง[บทที่แล้ว](/tutorial/8-react) หรือไปที่[สารบัญ](https://github.com/MicroBenz/js-stack-from-scratch#table-of-contents)
