# 3 - ตั้งค่าเพื่อใช้งาน ES6 โดยใช้ Babel และ Gulp

ตอนนี้เราจะมาใช้ ES6 syntax สำหรับการเขียนภาษา JavaScript กัน ซึ่งนับว่าเป็นอะไรที่พัฒนาขึ้นมาดีขึ้นมากเทียบกับ ES5 syntax "แบบเดิมๆ" ซึ่ง browsers ปัจจุบัน รวมถึงเหล่า JS environments ทั้งหลายที่มักใช้ๆ กันต่างเข้าใจ ES5 เป็นอย่างดี แต่ไม่เข้าใจ ES6 ดังนั้นทำให้เราต้องใช้เครื่องมือที่เรียกว่า Babel ในการแปลงจาก ES6 ไปเป็น ES5

เพื่อที่จะใช้งาน Babel เราจะมีการใช้ Gulp ด้วย Gulp นั้นเป็น task runner ซึ่งจะคล้ายคลึงกับ tasks ที่อยู่ใน `scripts` ในไฟล์ `package.json` แต่ว่าเราจะเขียน task เหล่านั้นด้วยโค้ดภาษา JavaScript ซึ่งแน่นอนว่ามันก็ง่ายกว่า และชัดเจนกว่าเขียนเป็น JSON เยอะ ดังนั้น เราจะติดตั้ง Gulp และ Babel plugin สำหรับ Gulp ด้วย โดยทำตามนี้

- สั่ง `yarn add --dev gulp`
- สั่ง `yarn add --dev gulp-babel`
- สั่ง `yarn add --dev babel-preset-latest`
- สั่ง `yarn add --dev del` (ใช้สำหรับ `clean` task เดี๋ยวจะมีในตัวอย่างด้านล่าง)
- ในไฟล์ `package.json` เพิ่ม field `babel` ไว้เป็นค่า config ให้กับ Babel เพื่อให้ Babel นั้นใช้ presets ตัวล่าสุด แบบนี้

```json
"babel": {
  "presets": [
    "latest"
  ]
},
```

**หมายเหตุ**: ไฟล์ `.babelrc` ที่อยู่ที่โปรเจคของเราก็สามารถใช้งานแทน field `babel` ที่อยู่ในไฟล์ `package.json` ได้เหมือนกัน ซึ่งในความเป็นจริง โปรเจคของเราก็จะมีขนาดใหญ่ขึ้นมากเรื่องๆ ดังนั้นการเอา config ของ Babel ไว้ใน `package.json` ก็เป็นสิ่งที่ดี เว้นแต่ว่า Babel config จะเริ่มใหญ่ขึ้นเรื่อยๆ จึงค่อยแยกออกมาอีกไฟล์

- ย้ายไฟล์ `index.js` ไปไว้ในโฟลเดอร์ชื่อว่า `src` (สร้างโฟลเดอร์ใหม่ หากยังไม่มี) ในโฟลเดอร์นี้เราจะเขียนโค้ดภาษา JavaScript แบบ ES6 กัน โดยเมื่อทำการ compile โค้ด ES6 เสร็จแล้ว โค้ด ES5 ที่ได้จะอยู่ในโฟลเดอร์ `lib` โดยที่ Gulp กับ Babel จะเป็นคนจัดการในการ compile และสร้างโฟลเดอร์ `lib` ขึ้นมาเอง แล้วให้ทำการลบโค้ดที่เกี่ยวกับ `color` ที่หลงเหลือจากตอนที่แล้ว และเขียนโค้ดด้านล่างแทน

```javascript
const str = 'ES6';
console.log(`Hello ${str}`);
```

โค้ดนี้เรามีการใช้สิ่งที่เรียกว่า *template string* ซึ่งเป็นฟีเจอร์ใหม่ใน ES6 ที่เราสามารถแทรกตัวแปรเข้าไปใน string ได้โดยตรง ไม่จำเป็นต้องทำการต่อ string แบบเดิมๆ อีกต่อไป โดยใช้  `${}`

สังเกตดูจะเห็นว่า template strings จะถูกเขียนโดยใช้สัญลักษณ์ **backquotes** (` )

- ต่อมาให้เราทำการสร้างไฟล์ `gulpfile.js` ในไฟล์ให้เขียนโค้ดดังต่อไปนี้

```javascript
const gulp = require('gulp');
const babel = require('gulp-babel');
const del = require('del');
const exec = require('child_process').exec;

const paths = {
  allSrcJs: 'src/**/*.js',
  libDir: 'lib',
};

gulp.task('clean', () => {
  return del(paths.libDir);
});

gulp.task('build', ['clean'], () => {
  return gulp.src(paths.allSrcJs)
    .pipe(babel())
    .pipe(gulp.dest(paths.libDir));
});

gulp.task('main', ['build'], (callback) => {
  exec(`node ${paths.libDir}`, (error, stdout) => {
    console.log(stdout);
    return callback(error);
  });
});

gulp.task('watch', () => {
  gulp.watch(paths.allSrcJs, ['main']);
});

gulp.task('default', ['watch', 'main']);

```

เรามาอธิบายโค้ดทั้งหมดนี้ให้เข้าใจกันก่อน

Gulp นั้นมี API ที่ค่อนข้างจะเข้าใจง่าย ใช้คำตรงไปตรงมา สิ่งที่เราทำก็คือ เรานิยาม `gulp.task` จำนวนมากที่อ้างอิงถึงไฟล์ได้ผ่าน `gulp.src` แล้ว chain คำสั่งต่อๆ กันด้วยคำสั่ง `.pipe()` (เช่น คำสั่ง `babel()` เป็นต้น) และได้ output ออกมาเป็นไฟล์ใหม่ โดยใช้ `gulp.dest` ในการอ้างอิง path ปลายทาง

นอกจากนี้เรายังมี `gulp.watch` ที่จะมองการเปลี่ยนแปลงของไฟล์ที่เราสนใจ เมื่อไฟล์เกิดการเปลี่ยนแปลง เราจะสั่งงานตาม tasks ที่เราระบุไว้ใน array (เช่น `['build']`) เป็นพารามิเตอร์ตัวที่สอง นอกจากนี้ยังมี API อีกมากมายให้ใช้ ซึ่งหากสนใจสามารถดูใน [documentation](https://github.com/gulpjs/gulp) ของ Gulp ได้

ในบรรทัดต้นๆ เราประกาศ object `paths` เพื่อเก็บ path ของไฟล์ที่เราจะใช้ทั้งหมด นั่นคือ path ของ source file `allSrcJs` และ path ของปลายทางที่เราต้องการ `libDir` และการทำแบบนี้ก็ช่วยให้เรา Don't Repeat Yourself (DRY) ได้อีกด้วย

หลังจากนั้น เรานิยาม tasks (งาน) มา 5 งาน: `build`, `clean`, `main`, `watch`, และ `default`

- `build` จะเป็น task ที่ Babel จะถูกเรียกใช้เพื่อแปลง source file ทั้งหมดที่เราเขียนในโฟลเดอร์ `src` และบันทึกผลสุดท้ายที่แปลงสำเร็จแล้วลงโฟลเดอร์ `lib`
- `clean` เป็น task ที่เราจะทำการเคลียร์ข้อมูลในโฟลเดอร์ `lib` ที่ถูกสร้างขึ้นมาเองด้วย Gulp ทั้งหมด โดยจะถูกเรียกก่อนที่จะทำ task `build` ทุกครั้ง ซึ่ง task นี้มีประโยชน์ในการลบไฟล์เก่าทิ้งไปให้หมด เพื่อให้เหมือนเป็นการที่เราจะ sync ผลลัพธ์ให้ตรงกับต้นฉบับในโฟลเดอร์ `src` อยู่ตลอด โดยเราใช้ package ชื่อว่า `del` ในการลบไฟล์ทิ้ง ซึ่งเหมาะกับการใช้คู่กันกับ Gulp's stream (ซึ่งวิธีนี้เป็นคำ[แนะนำ](https://github.com/gulpjs/gulp/blob/master/docs/recipes/delete-files-folder.md) ในการลบไฟล์ที่ดี โดยใช้ Gulp)
- `main` มีค่าใกล้เคียงกับการสั่ง `node .` ในครั้งที่แล้ว แต่ครั้งนี้เราต้องการรันโค้ดที่อยู่ภายใน `lib/index.js` แทน เพราะปกติ Node จะมองหา `index.js` เป็นค่า default เราแค่สั่ง `node lib` ก็ได้ผลเหมือนเดิม (ในที่นี้เราใช้ตัวแปร `libDir` เลยเพื่อให้เรานั้นไม่ทำอะไรซ้ำซ้อนหลายๆ รอบ) ส่วนคำสั่ง `require('child_process').exec` และ `exec` ใน task นั้นเป็น function ของ Node ที่ให้เรา execute shell command ได้ เราส่งตัวแปร `stdout` ไปให้กับ `console.log()` และให้ return error ที่อาจเกิดขึ้นได้โดยใช้ callback function ของ `gulp.task` มาช่วย โอเค หากคุณยังรู้สึกงงๆ อยู่บ้าง ก็ไม่เป็นไร ขอสรุปว่า task นี้จะแค่สั่ง `node lib` ให้กับเราโดยอัตโนมัติ
- `watch` จะสั่งรัน task `main` เมื่อ filesystem พบว่ามีการเปลี่ยนแปลงเกิดขึ้นกับ file ที่เราระบุไว้ในฟังก์ชัน (ในทีนี้ก็คือ หากไฟล์ในโฟลเดอร์ `src` เกิดการเปลี่ยนแปลง ให้สั่งงาน task `main` ทันที)
- `default` เป็น task พิเศษที่จะทำงานเมื่อเราสั่งแค่ `gulp` เฉยๆ จาก Command Line (CLI) ในเคสนี้เราจะให้รัน task `watch` กับ `main`

**หมายเหตุ**: คุณอาจจะกำลังสงสัยว่าทำไมเราเขียน ES6 ใน Gulp file ของเราได้ ทั้งๆ ที่เราไม่ได้แปลงมันเป็น ES5 ด้วย Babel เลยนี่หนา? นั่นเป็นเพราะว่าเราเลือกใช้ Node เวอร์ชันใหม่ที่รองรับการใช้ ES6 อยู่แต่แรกแล้ว ทำให้เราเขียนโค้ด ES6 บน Gulp file ได้ (ดังนั้น โปรดเช็คให้มั่นใจว่าใช้งาน Node เวอร์ชันที่ใหม่กว่า 6.5.0 เป็นต้นไปแล้ว โดยใช้คำสั่ง `node -v` ในการเช็ค)

เอาล่ะ! เรามาดูกันว่า task เหล่านี้ใช้งานได้

- ใน `package.json` เปลี่ยน `start` script ให้เป็น `"start": "gulp"`
- สั่ง `yarn start` เราควรจะเห็น "Hello ES6" ขึ้นมา แล้ว Gulp จะเริ่มมองการเปลี่ยนแปลงของไฟล์ ให้ลองเขียนโค้ดผิดๆ ดูในไฟล์ `src/index.js` เพื่อดูว่า Gulp จะแสดงผล error โดยอัตโนมัติ หลังจากที่คุณเซฟไฟล์ใหม่แล้ว
- เพิ่มโฟลเดอร์ `/lib/` ไปใน `.gitignore` (ไม่จำเป็นที่จะต้อง commit โค้ดในโฟลเดอรนี้ลงไป เพราะอย่างไรก็ตามเราสามารถทำการ compile ได้อยู่แล้ว เพียงแค่มี source code)

บทถัดไป [4 - การใช้ ES6 syntax ในการเขียน Class](/tutorial/4-es6-syntax-class)

กลับไป[บทที่แล้ว](/tutorial/2-packages) หรือไปที่[สารบัญ](https://github.com/MicroBenz/js-stack-from-scratch#table-of-contents).
