# บทที่ 5 - การใช้ ES6 syntax ในการสร้าง modules

ในบทนี้เราจะแทน `const Dog = require('./dog')` จากบทที่แล้ว ด้วย `import Dog from './dog'` แทน ซึ่งเป็น syntax ใหม่สำหรับการจัดการ modules ของ ES6 (ซึ่งจะตรงข้ามกับ modules syntax ของ "CommonJS")

ใน `dog.js` เราจะแทน `module.exports = Dog` ด้วย `export default Dog` (เช่นเดียวกับด้านบน คำสั่งนี้เป็น syntax ใหม่ใน ES6)

ให้จำไว้ว่า ใน `dog.js` ชื่อ `Dog` นั้นจะถูกใช้เฉพาะในการ `export` แต่ว่าเราก็สามารถ export anonymous class (คลาสที่ไม่มีชื่อ) ออกไปได้เช่นกับ ดังตัวอย่าง

```javascript
export default class {
  constructor(name) {
    this.name = name;
  }

  bark() {
    return `Wah wah, I am ${this.name}`;
  }
}
```

ซึ่งทำให้ในไฟล์ `index.js` นั้นเราไม่จำเป็นต้องใช้ 'Dog' สำหรับการ `import` เข้ามาแล้ว เราจะตั้งชื่อเป็นอะไรก็ได้ เพราะคลาสที่ถูก export ออกมานั้นเป็น anonymous class ทำให้เราตั้งชื่อเป็นอะไรก็ได้ เพื่ออ้างอิงถึงคลาสดังกล่าว ดังเช่นตัวอย่างด้านล่างนี้

```javascript
import Cat from './dog';

const toby = new Cat('Toby');
```

แต่แน่นอนว่า เราก็ควรจะใช้ชื่อให้ตรงกับชื่อคลาส หรือ module ที่เรา import มาอยู่แล้ว (คงแปลกน่าดูที่เราไป import Cat มาจาก dog) แต่ก็มีบางกรณีที่เราอาจจะตั้งชื่อไม่ตรงกับสิ่งที่เรา import มา เช่น `const babel = require('gulp-babel')` ใน Gulp file

อ้าว แล้วทีนี้ใน `gulpfile.js` เราไม่ใช้ `require()` แล้วแต่เราใช้ `import` แทนได้ไหม? ช่าวร้ายคือแม้ว่า Node เวอร์ชันล่าสุดจะรองรับฟีเจอร์ของ ES6 ได้เป็นส่วนมาก แต่ก็ยังไม่รองรับการใช้ ES6 modules

แต่ในความโชคร้าย ก็มีความโชคดีที่เราสามารถให้ Gulp เรียก Babel มาช่วยงานเราได้ โดยเพียงแค่เปลี่ยนชื่อไฟล์จาก `gulpfile.js` เป็น `gulpfile.babel.js` Babel จะช่วยให้เราจัดการ `import` modules ของ Gulp แบบ ES6 modules ได้ โดยขั้นตอนง่ายๆ เพียงแค่

- เปลี่ยนชื่อไฟล์ `gulpfile.js` เป็น `gulpfile.babel.js`

- แทนคำสั่ง `require()` ด้วย ES6 modules import ดังนี้

```javascript
import gulp from 'gulp';
import babel from 'gulp-babel';
import del from 'del';
import { exec } from 'child_process';
```

สังเกตว่า syntax ของการนำ `exec` มาใช้จาก `child_process` นั้นดูดีทีเดียวเชียว

- สั่ง `yarn start` เราก็จะเห็นคำว่า "Wah wah, I am Toby" เหมือนเดิม

บทถัดไป [บทที่ 6 - การใช้ ESLint](/tutorial/6-eslint)

กลับไปยัง[บทที่แล้ว](/tutorial/4-es6-syntax-class) หรือไปที่[สารบัญ](https://github.com/MicroBenz/js-stack-from-scratch#table-of-contents).
