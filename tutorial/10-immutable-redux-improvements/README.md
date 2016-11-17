# 10 - Immutable JS และ Redux Improvements

## Immutable JS

แตกต่างกับบทที่แล้วโดยสิ้นเชิง เนื้อหาในบทนี้จะง่ายขึ้นมาก ซึ่งเกี่ยวข้องกับการใช้งาน Redux ให้มีประสิทธิภาพมากขึ้น

แรกสุด เราจะทำการเพิ่ม **Immutable JS** เข้าไปในโค้ดเดิมของเรา Immutable นั้นเป็น library ที่ช่วยให้เราจัดการ, แก้ไข object ได้โดยไม่แก้ไข object ตรงๆ เช่น แทนที่จะทำแบบนี้

```javascript
const obj = { a: 1 };
obj.a = 2; // เปลี่ยนแปลง `obj` ตัวเดิม
```

เราจะทำแบบนี้แทน

```javascript
const obj = Immutable.Map({ a: 1 });
obj.set('a', 2); // ได้ object ก้อนใหม่มา โดยที่ไม่ได้แก้ไขค่าใน `obj` ตัวเดิมตรงๆ
```

วิธีการแบบนี้ทำให้เราสามารถเขียนโปรแกรมในลักษณะของ **functional programming** ได้ ซึ่งจะเป็นประโยชน์มากเมื่อใช้หลักการเขียนโปรแกรมแบบนี้คู่กับ Redux เพราะถ้าดูดีๆ reducer function ของเรานั้น*ต้อง*เป็น pure function ที่ไม่ได้แก้ไข state ที่ถูกส่งมาเป็น parameter ตรงๆ แต่แปลงไปเป็น state object ก้อนใหม่แทน ซึ่งการใช้ Immutable จะช่วยงานเราในส่วนนี้ได้

- สั่ง `yarn add immutable`

เราจะมีการใช้ `Map` ในโปรเจคของเรา แต่ใน ESLint และ Airbnb นั้นจะบ่นเราเรื่องของการใช้ตัวแปรชื่อพิมพ์ใหญ่ทั้งๆ ที่มันไม่ใช่ class ให้เราทำการเพิ่มค่าส่วนนี้เข้าไปใน `package.json` ในส่วนของ `eslintConfig`

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

นั่นจะทำให้เราใช้ `Map` กับ `List` (Immutable objects สองชนิดที่เรามักจะใช้แทบจะทุกครั้ง) ได้แล้ว โดยที่ ESLint มองข้ามกฎการตั้งชื่อเริ่มต้นด้วยตัวพิมพ์ใหญ่ไป

กลับมาที่เรื่องของ Immutable กัน ใน `dog-reducer.js` ให้แก้ไขโค้ดให้มีหน้าตาดังนี้

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

ตอนนี้จะเห็นว่า state เริ่มต้นจะถูกสร้างมา โดยใช้ Immutable Map แล้ว และ state ใหม่จะถูกสร้างมาโดยใช้ function `set()` เผื่อหลีกเลี่ยงการเปลี่ยนแปลงค่าใน state เก่าโดยตรง

ในโค้ด `containers/bark-message.js` แก้ function `mapStateToProps` ให้ใช้ `.get('hasBarked')` แทนที่จะใช้ `.hasBarked`

```javascript
const mapStateToProps = state => ({
  message: state.dog.get('hasBarked') ? 'The dog barked' : 'The dog did not bark',
});
```

แอพจะทำงานได้เหมือนเดิม ตามที่เราเคยทำในบทที่แล้ว

**หมายเหตุ**: ถ้า Babel แจ้งเรื่องเกี่ยวกับ Immutable มีขนาดเกิน 100KB ให้เพิ่ม `"compact": false` ในไฟล์ `package.json` ภายใต้ field `babel`

ดังที่เห็นใน code ด้านบน state object ของเรายังคงเก็บ เป็น plain object ที่มี `dog` เป็น attribute เหมือนเดิม ซึ่งไม่ใช่ immutable object ซึ่งเป็นเรื่องที่รับได้โดยปกติ แต่ถ้าหากเราต้องการให้ทุกอย่างถูกจัดการด้วยความเป็น immutable objects เท่านั้น คุณต้องใช้ package `redux-immutable` เพื่อแทนที่ function `combineReducers` ของ Redux ไปด้วย

**ส่วนนี้จะทำหรือไม่ทำก็ได้ แต่หากอยากใช้ `redux-immutable` ก็ให้ทำตามนี้**

- สั่ง `yarn add redux-immutable`
- แทน function `combineReducers` ในไฟล์ `app.jsx` โดยใช้ package ที่ import มาจาก `redux-immutable` แทน
- ในไฟล์ `bark-message.js` แทน `state.dog.get('hasBarked')` ด้วย `state.getIn(['dog', 'hasBarked'])`

## Redux Actions

เมื่อคุณเริ่มเพิ่ม actions เข้าไปในแอพมากขึ้น เราจะค้นพบว่าเรามักจะทำอะไรซ้ำซากคล้ายๆ เดิมเยอะเหลือเกิน package `redux-actions` ช่วยให้เราลดความซ้ำซากเหล่านั้นได้ ด้วยความช่วยเหลือของ `redux-actions` เราสามารถเขียนโค้ด `dog-actions.js` ให้บางลงได้เยอะ แบบนี้

```javascript
import { createAction } from 'redux-actions';

export const MAKE_BARK = 'MAKE_BARK';
export const makeBark = createAction(MAKE_BARK, () => true);
```

`redux-actions` เป็นหนึ่งในการ implement ของ [Flux Standard Action](https://github.com/acdlite/flux-standard-action) model เหมือนๆ กับ action ที่เราเคยเขียนก่อนหน้านั้น ดังนั้นการใช้ `redux-actions` เหมือนให้เราเขียนโค้ดสั้นลง แต่ได้ผลเหมือนเดิม

- อย่าลืมที่จะสั่ง `yarn add redux-actions` เข้าไปด้วยก่อนแก้โค้ดนี้

บทถัดไป [11 - Testing with Mocha, Chai, and Sinon](/tutorial/11-testing-mocha-chai-sinon)

กลับไปยัง[บทที่แล้ว](/tutorial/9-redux) หรือไปที่[สารบัญ](https://github.com/MicroBenz/js-stack-from-scratch#table-of-contents)
