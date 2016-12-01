# บทที่ 4 - การใช้ ES6 syntax ในการเขียน Class

- สร้างไฟล์ใหม่ `src/dog.js` ที่มีโค้ด ES6 class ดังนี้

```javascript
class Dog {
  constructor(name) {
    this.name = name;
  }

  bark() {
    return `Wah wah, I am ${this.name}`;
  }
}

module.exports = Dog;
```

หากคุณคุ้นเคยกับการเขียนโปรแกรมแบบ OOP ในภาษาอื่นๆ จะดูไม่แปลกใจกับคลาสของ ES6 มากนัก ซึ่งคลาสนั้นสามารถ export ให้ภายนอกสามารถใช้งานได้ ผ่านคำสั่ง `module.exports`

และแน่นอน โค้ดต่างๆ ของ ES6 สามารถใช้งานในคลาสได้ทั้งหมด เช่น `const`, `let` รวมถึง "template strings" อย่างที่ใช้ใน function `bark()` รวมถึง arrow functions เช่น `(param) => { console.log('Hi'); }`) ก็ทำได้ แต่ในตัวอย่างของบทนี้เราจะไม่มีการใช้ arrow function เพื่อให้เกิดความคุ้นเคยกับ syntax แบบเดิมก่อนในการสร้าง class

ในไฟล์ `src/index.js` เขียนโค้ดดังต่อไปนี้

```javascript
const Dog = require('./dog');

const toby = new Dog('Toby');

console.log(toby.bark());
```

ถ้าเราสังเกต จะต่างกับ package `color` ที่เราเคยใช้ เมื่อเราต้องการ require ไฟล์มาใช้ เราจะใช้ `./` ใน require() เพื่อทำการ require class มาใช้งาน

- สั่ง `yarn start` แล้วเราจะเห็นคำว่า 'Wah Wah, I am Toby'

- ดูภายในโค้ดที่ถูก generate ภายในโฟลเดอร์ `lib` เพื่อดูโค้ดที่ถูก compile แล้วว่าหน้าตาเป็นอย่างไร (เช่น เราจะพบว่า มีการใช้ `var` แทนที่จะเป็น `const`)

บทถัดไป [บทที่ 5 - การใช้ ES6 syntax ในการสร้าง modules](/tutorial/5-es6-modules-syntax)

กลับไปยัง[บทที่แล้ว](/tutorial/3-es6-babel-gulp) หรือไปที่[สารบัญ](https://github.com/MicroBenz/js-stack-from-scratch#table-of-contents)
