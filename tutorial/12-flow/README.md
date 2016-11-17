# 12 - เช็ค Data Type ด้วย Flow

[Flow](https://flowtype.org/) เป็นตัวทำ static type checker ที่จะทำการตรวจสอบหาประเภทของ data types ที่ไม่สอดคล้องกันในโค้ดได้ ซึ่งทำให้คุณสามารถเพิ่มการประกาศประเภทของข้อมูลเพิ่มเติมได้ด้วย ผ่าน annotations พิเศษของ Flow

- ในการที่จะให้ Babel เข้าใจและลบ annotation ของ Flow ทิ้งตอนที่ทำการ compile นั้น ให้ทำการติดตั้ง Flow present ของ Babel โดยสั่ง `yarn add --dev babel-preset-flow` หลังจากนั้นให้ทำการเพิ่ม `"flow"` ลงไปภายใน `babel.presets` ในไฟล์ `package.json`

- สร้างไฟล์เปล่า `.flowconfig` ใน root ของโปรเจค

- สั่ง `yarn add --dev gulp-flowtype` เพื่อติดตั้ง Gulp plugin สำหรับใช้งาน Flow และเพิ่ม `flow()` เข้าไปใน task `lint`

```javascript
import flow from 'gulp-flowtype';

// [...]

gulp.task('lint', () =>
  gulp.src([
    paths.allSrcJs,
    paths.gulpFile,
    paths.webpackFile,
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(flow({ abort: true })) // Add Flow here
);
```

option `abort` มีไว้เพื่อบอกว่าให้หยุดการทำงานของ Gulp task เมื่อ Flow ตรวจเจอ issue ขึ้นมา

เมื่อทำทั้งหมดข้างต้นเสร็จแล้ว ณ ตอนนี้ก็ควรสามารถใช้งาน Flow ได้แล้ว

- เพิ่ม Flow annotation ใน `src/shared/dog.js` ตามโค้ดด้านล่างนี้

```javascript
// @flow

class Dog {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  bark(): string {
    return `Wah wah, I am ${this.name}`;
  }

  barkInConsole() {
    /* eslint-disable no-console */
    console.log(this.bark());
    /* eslint-enable no-console */
  }

}

export default Dog;
```

comment `// @flow` ใช้เพื่อบอก Flow ว่าเราต้องการให้ไฟล์นี้ทั้งไฟล์ถูกตรวจสอบ data type โดย Flow annotation จะมีลักษณะเป็น colon (:) ตามหลังพารามิเตอร์ของฟังก์ชัน หรือด้านหลังชื่อฟังก์ชัน ซึ่งคุณสามารถดู documentation ของ Flow ได้สำหรับรายละเอียดเพิ่มเติม

ดังนั้น เมื่อคุณรัน `yarn start` ไป Flow ก็จะทำงานได้ตามปกติ แต่ ESLint จะบ่นเราเรื่องที่มี syntax ที่ผิดมาตรฐานถูกใช้อยู่ แต่บังเอิญเป็นเรื่องดีที่ว่า plugin `babel-preset-flow` นั้นช่วยให้ตัว parser ของ Babel เข้าใจว่าจุดที่แปลกๆ นั้นคือ Flow content นั่นเอง ซึ่งจะเป็นการดีมาก หาก ESLint นั้นเลือกที่จะเชื่อมั่นในตัว parser ของ Babel แทนที่จะมานั่งทำความเข้าใจ Flow annotation เอง ดังนั้นเราจึงมีการใช้ package `babel-eslint` เพื่อให้ ESLint เชื่อมั่นในตัว parser ของ Babel แทนว่าโค้ดที่เราเขียนนั้นไม่มีปัญหาเรื่อง syntax แปลกประหลาดแต่อย่างใด

- สั่งรัน `yarn add --dev babel-eslint`

- ในไฟล์ `package.json` ในส่วนของ `eslintConfig` เพิ่ม property `"parser": "babel-eslint"` ลงไป

เมื่อสั่ง `yarn start` ณ ตอนนี้จะพบว่าทั้งการทำ linting และ typecheck ในโค้ดของคุณนั้นทำงานได้อย่างปกติสุขไม่มีปัญหาอะไร

ตอนนี้ ESLint และ Babel นั้นสามารถ share parser ด้วยกันได้แล้ว เราสามารถใช้ ESLint เพื่อทำการ lint Flow annotation ได้แล้ว ผ่าน plugin `eslint-plugin-flowtype`

- สั่ง `yarn add --dev eslint-plugin-flowtype` และเพิ่ม `"flowtype"` ลงไปใน `eslintConfig.plugins` ในไฟล์ `package.json`

- ทำการเพิ่ม `"plugin:flowtype/recommended"` ลงไปใน `eslintConfig.extends` ใน array ช่องถัดจาก `"airbnb"` ที่อยู่ในไฟล์ `package.json` ด้วย

ตอนนี้ ถ้าคุณพิมพ์ `name:string` เป็น annotation ESLint จะทำการบ่นคุณว่าลืมเติมช่องว่างหลัง colon ให้ไปเติมด้วย

**หมายเหตุ**: property `"parser": "babel-eslint"` ที่ให้เพิ่มใน `package.json` นั้นจริงๆ แล้วถูกรวมอยู่ใน config ของ `"plugin:flowtype/recommended"` อยู่แล้ว ดังนั้นคุณสามารถลบมันทิ้งได้ เพื่อลดขนาดของ `package.json` ลงได้ แต่คุณสามารถปล่อยให้เป็นแบบนั้นไว้ได้ เพื่อให้เกิดความชัดเจนเวลามีคนอื่นสงสัยว่า parser หายไปไหน ทำไมไม่มี ดังนั้น เรื่องนี้จึงเป็นเรื่องส่วนบุคคล ว่าอยากจะเก็บไว้หรือไม่ แต่เนื่องจาก tutorial นี้จะเน้นให้ minimal มากที่สุด ดังนั้นผม(ผู้เขียน) จึงขอลบออก

- ตอนนี้คุณสามารถเพิ่ม `// @flow` ในทุกไฟล์ที่มีนามสกุล `.js` และ `.jsx` ที่อยู่ภายในโฟลเดอร์ `src`  ได้แล้ว โดยสามารถสั่ง `yarn test` หรือ `yarn start` และเพิ่ม type annotation ให้กับทุกที่ที่ Flow บอกให้คุณเพิ่ม

ต่อมา เรามีหนึ่งตัวอย่างที่น่าสนใจมานำเสนอ (และอาจจะดูขัดใจแปลกๆ) สำหรับไฟล์ `src/client/components/message.jsx'

```javascript
const Message = ({ message }: { message: string }) => <div>{message}</div>;
```

เราจะเห็นว่า เมื่อเราทำการ destructuring พารามิเตอร์ในฟังก์ชันแล้ว เราจะต้องทำ type annotate กับ properties ที่จะถูกแกะออกมาด้วย โดยใช้หลักการทำ object literal notation (การประกาศ Object โดยใช้ { }) ซึ่งในทีนี้เราให้ตัวแปร `message` มี type เป็น string

อีกกรณีนึงที่คุณอาจจะเจอ คือในไฟล์ `src/client/reducers/dog-reducer.js` Flow จะบ่นเรื่องของ Immutable ไม่มี default export ซึ่ง issue นี้ก็ยังเป็นที่ถกเถียงกันใน [Issue#863 on Immutable](https://github.com/facebook/immutable-js/issues/863) ที่มี workarounds อยู่สองแบบ

```javascript
import { Map as ImmutableMap } from 'immutable';
// หรือ
import * as Immutable from 'immutable';
```

จนกว่าเจ้าของ Immutable จะทำการประกาศแจ้งเรื่อง issue นี้อีกทีนึงในอนาคต ให้เลือกใช้อันที่คุณคิดว่าดีกว่าในการ import Immutable components มาใช้ ซึ่งส่วนตัวผม(ผู้เขียน) เลือกใช้ `import * as Immutable from 'immutable'` เพราะโค้ดสั้นกว่า และไม่ต้องทำ refactoring โค้ดเดิมเลย

**หมายเหตุ**: ถ้า Flow ตรวจเจอ type errors ในโฟลเดอร์ `node_modules` ให้เพิ่ม `[ignore]` section ในไฟล์ `.flowconfig` เพื่อให้ ignore เฉพาะ package ที่ก่อให้เกิด issue ดังกล่าวเป็นกรณีพิเศษไป (อย่า ignore ทั้งโฟลเดอร์ `node_modules` นะ) โดยหน้าตาจะประมาณนี้

```flowconfig
[ignore]

.*/node_modules/gulp-flowtype/.*
```

ในกรณีที่ผม(ผู้เขียน) เจอมา plugin `linter-flow` ของ Atom ถูก detect ว่ามี type errors ในโฟลเดอร์ `node_modules/gulp-flowtype` ซึ่งมีการระบุว่าใช้ `// @flow` ด้วย จึง ignore เฉพาะโฟลเดอร์ดังกล่าวไป ตามตัวอย่างที่แสดงด้านบน

ณ ตอนนี้ คุณก็จะต้องเขียนโค้ดที่ผ่านการ lint, typecheck และถูกรัน test ครบถ้วนแล้วก่อนที่จะ build เยี่ยมยอดมาก!

กลับไปยัง[บทที่แล้ว](/tutorial/11-testing-mocha-chai-sinon) หรือไปที่[สารบัญ](https://github.com/MicroBenz/js-stack-from-scratch#table-of-contents)
