# บทที่ 2 - ติดตั้งและใช้งาน package

บทนี้เราจะสอนวิธีการติดตั้งและใช้งาน package กัน package คือโค้ดที่มีคนอื่นเคยเขียนไว้แล้ว และเราสามารถนำมาใช้ได้ ซึ่ง package นั้นสามารถเป็นอะไรก็ได้ ในตัวอย่างนี้เราจะลองใช้ package ที่ช่วยให้เราจัดการเรื่องสีได้ดีขึ้น ซึ่ง package ที่ว่านั้นเราไปเอาจากของคนอื่นเขามาใช้ ไม่ได้เขียนเอง

- ติดตั้ง package ชื่อ `color` (เป็น community-made package) โดยสั่ง `yarn add color`

เปิดไฟล์ `package.json` จะเห็นว่า Yarn ได้ทำการเพิ่ม `color` เข้าไปใน `dependencies` แล้วเรียบร้อย

นอกจากนี้ โฟลเดอร์ `node_modules` ก็ยังถูกสร้างขึ้นมาเพื่อเก็บ package ไว้อีกด้วย

- เพิ่ม `node_modules/` เข้าไปใน `.gitignore` (และสั่ง `git init` ด้วย เพื่อสร้าง repo ถ้ายังไม่ได้ทำ)

ถ้าสังเกต คุณจะเห็นว่ามีไฟล์ `yarn.lock` ที่ Yarn generate ขึ้นมาด้วย ซึ่งไฟล์นี้นั้นก็ควรจะต้องถูก commit ด้วย เพื่อรับประกันว่าทุกคนในทีมจะใช้ package ที่มีเวอร์ชันตรงกันทุกคน แต่ถ้าหากคุณใช้ NPM แทน Yarn นั้น NPM จะมีไฟล์ที่ทำหน้าที่เดียวกัน เรียกว่า *shrinkwrap*

- เพิ่ม `const Color = require('color');` ไปใน `index.js`
- ใช้งาน package ดังกล่าวได้ เช่น `const redHexa = Color({r: 255, g: 0, b: 0}).hexString();`
- เพิ่ม `console.log(redHexa)`
- สั่ง `yarn start` จะเห็น `#FF0000`

ยินดีด้วย! คุณได้ติดตั้งและใช้งาน package แล้ว!

`color` ถูกใช้ในบทนี้เพื่อให้เข้าใจวิธีการใช้ package เล็กๆ ซึ่งเราไม่ต้องการใช้อีกแล้ว เราก็ลบทิ้งได้ โดย

- สั่ง `yarn remove color`

**Note**: ใน dependencies นั้นจะมีอยู่สองประเภท, `"dependencies"` กับ `"devDependencies"` `"devDependencies"` นั้นจะเป็น package ที่จำเป็นเฉพาะในตอน development เท่านั้น ไม่ได้นำไปใช้ตอน production (ปกติมักจะเป็นพวก package ที่เกี่ยวข้องกับการ build ต่างๆ, linters และอื่นๆ) ซึ่งสำหรับ `"devDependencies"` เราจะใช้ `yarn add --dev [package]` ในการเพิ่ม `"devDependencies"`

บทถัดไป [บทที่ 3 - ตั้งค่าเพื่อใช้งาน ES6 โดยใช้ Babel และ Gulp](/tutorial/3-es6-babel-gulp)

กลับไปยัง[บทที่แล้ว](/tutorial/1-node-npm-yarn-package-json) หรือไปที่[สารบัญ](https://github.com/MicroBenz/js-stack-from-scratch#table-of-contents)
