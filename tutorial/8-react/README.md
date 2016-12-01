# บทที่ 8 - React

ในบทนี้เราจะมาสร้างแอพเรา โดยใช้ React เป็น Front-End

แรกสุด เราติดตั้ง React และ ReactDOM ก่อน

- สั่ง `yarn add react react-dom`

package ทั้งสองอันนี้จะไปอยู่ใน `"dependencies"` ไม่ใช่ `"devDependencies"` เพราะทั้งสองอันนี้ไม่ใช่ build tools แต่เป็น client bundle ที่เราต้องใช้ตอน production

แก้ชื่อไฟล์ `src/client/app.js` เป็น `src/client/app.jsx` และเขียนโค้ด React และ JSX ดังต่อไปนี้ลงไป

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

**หมายเหตุ**: ถ้าคุณไม่คุ้นเคยกับ React หรือ PropTypes ให้ไปเรียนรู้เบสิคของ React มาก่อน แล้วกลับมายัง Tutorial นี้ต่อ เพราะในบทถัดๆ ไปจะมีคอนเซปต่างๆ ของ React ที่จะถูกใช้อย่างมาก ทำให้เป็นเรื่องดีหากคุณมีความเข้าใจเกี่ยวกับ React ระดับหนึ่งก่อนที่จะไปต่อจากนี้

ใน Gulpfile เปลี่ยนค่าของ `clientEntryPoint` ให้เป็นนามสกุล `.jsx` ด้วย

```javascript
clientEntryPoint: 'src/client/app.jsx',
```

เนื่องจากเรามีการใช้ syntax ของ JSX เราต้องบอกให้ Babel รู้ว่าเราต้องแปลง JSX ด้วยนะ โดยการที่ติดตั้ง preset React Babel ที่จะสอนให้ Babel รู้จักวิธีการ process syntax ของ JSX โดยให้สั่ง `yarn add --dev babel-preset-react` และเปลี่ยน `babel` ที่อยู่ใน `package.json` ให้เป็นแบบนี้

```json
"babel": {
  "presets": [
    "latest",
    "react"
  ]
},
```

ตอนนี้ หลังจากสั่ง `yarn start` เมื่อเราเปิด `index.html` เราจะเห็น "The dog says: Wah wah, I am Browser Toby" ที่ถูก render ด้วย React

บทถัดไป [บทที่ 9 - Redux](/tutorial/9-redux)

กลับไปยัง[บทที่แล้ว](/tutorial/7-client-webpack) หรือไปที่[สารบัญ](https://github.com/MicroBenz/js-stack-from-scratch#table-of-contents)
