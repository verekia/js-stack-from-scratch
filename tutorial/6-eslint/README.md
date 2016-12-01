# บทที่ 6 - การใช้ ESLint

ในบทนี้เราจะสอนการ 'lint' (ตรวจสอบ) โค้ดของเราเพื่อหา issues ต่างๆ ที่อาจเกิดขึ้นได้ ซึ่ง ESLint เป็น linter ตัวหนึ่งสำหรับการทำ lint กับโค้ดของ ES6 โดยที่เราสามารถกำหนดกฎ (rules) ต่างๆ ที่เราต้องการให้โค้ดเราจะเป็นได้ ซึ่งเราจะใช้กฎที่สร้างโดย Airbnb โดยที่กฎของ Airbnb นั้นมีการใช้งาน plugin บางตัวด้วย ทำให้เราต้องติดตั้ง plugin เหล่านั่นเพื่อที่จะใช้กฎดังกล่าวที่ Airbnb เขียนเอาไว้ โดยทำตามนี้

- สั่ง `yarn add --dev eslint eslint-config-airbnb eslint-plugin-import eslint-plugin-jsx-a11y@2.2.3 eslint-plugin-react`

ดังที่เห็น เราสามารถติดตั้ง package หลายๆ ตัวได้ด้วยคำสั่งเดียว ซึ่ง package เหล่านี้ก็จะถูกเพิ่มไปใน `package.json` โดยอัตโนมัติ

ใน `package.json` เพิ่ม field `eslintConfig` หน้าตาตามนี้

```json
"eslintConfig": {
  "extends": "airbnb",
  "plugins": [
    "import"
  ]
},
```

ส่วนของ `plugins` จะเป็นจุดที่บอก ESLint ว่าเราใช้ import syntax ของ ES6

**หมายเหตุ**: ไฟล์ `.eslintrc.js`, `.eslintrc.json`, หรือ `.eslintrc.yaml` ที่อยู่ใน root ของโปรเจคนั้นใช้แทน `eslintConfig` ที่อยู่ใน `package.json` เหมือนกัน คล้ายๆ กับ configuration ของ Babel เราพยายามจะไม่ให้ root ของโปรเจคมีไฟล์เยอะเกินไป แต่ถ้าหาก ESLint config คุณเริ่มใหญ่ขึ้นเรื่อยๆ ก็ควรจะเขียนไฟล์แยกออกมา

เราจะสร้าง Gulp task เพื่อสั่งรัน ESLint ให้กับเรา ดังนั้นเราต้องติดตั้ง plugin ให้กับ Gulp ด้วยเช่นเดียวกัน

- สั่ง `yarn add --dev gulp-eslint`

เพิ่ม task เหล่านี้ลงไปในไฟล์ `gulpfile.babel.js`:

```javascript
import eslint from 'gulp-eslint';

const paths = {
  allSrcJs: 'src/**/*.js',
  gulpFile: 'gulpfile.babel.js',
  libDir: 'lib',
};

// [...]

gulp.task('lint', () => {
  return gulp.src([
    paths.allSrcJs,
    paths.gulpFile,
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
```

เราบอกให้ task นี้ของ Gulp ให้ทำการ include `gulpfile.babel.js` และไฟล์ JS ที่อยู่ในโฟลเดอร์ `src` ทั้งหมด เป็น source ต้นทางของ task (นั่นคือเราจะทำการ linting `gulpfile.babel.js` ด้วย)

แก้ไข `build` Gulp task โดยให้ task `lint` ทำงานก่อนที่จะทำ task `build` และ `clean`

```javascript
gulp.task('build', ['lint', 'clean'], () => {
  // ...
});
```

- สั่ง `yarn start` เราจะพบ linting error จำนวนมากภายใน Gulpfile และ warning การใช้ `console.log()` ใน `index.js`

หนึ่งใน issue ที่คุณพบคือ `'gulp' should be listed in the project's dependencies, not devDependencies (import/no-extraneous-dependencies)` ซึ่งจริงๆ แล้ว error นี้เป็น False Negative ที่ฟ้อง error ผิด ทั้งๆ ที่จริงๆ แล้วมันไม่ควร error แบบนี้ เพราะ ESLint ไม่สามารถรู้ได้ว่าไฟล์ JS ไฟล์ไหนนั้นใช้สำหรับการ build เท่านั้น และไฟล์ไหนไม่ใช้ในการ build ซึ่ง gulp นั้นจัดว่าเป็น devDependencies อยู่แล้ว เพราะใช้เฉพาะตอน build เท่านั้น

ดังนั้น เราต้องการความช่วยเหลือเล็กๆ น้อยๆ โดยทำการ comment บางอย่างลงไปในโค้ด ใน `gulpfile.babel.js` ให้เพิ่ม comment นี้ไปที่บรรทัดบนสุดว่า

```javascript
/* eslint-disable import/no-extraneous-dependencies */
```

ทำให้ ESLint จะไม่นำกฎ `import/no-extraneous-dependencies` มาใช้ตรวจสอบในไฟล์นี้

ตอนนี้เราจะเหลือแค่ issue `Unexpected block statement surrounding arrow body (arrow-body-style)` ซึ่งอันนี้เป็น issue ที่แจ้งมาดี เพราะ ESLint บอกว่ามีวิธีที่ดีกว่านี้ในการเขียนโค้ด

```javascript
() => {
  return 1;
}
```

ให้เป็นแบบนี้แทน

```javascript
() => 1
```

เพราะเมื่อ function มีหน้าที่แค่ return อย่างเดียว เราไม่จำเป็นต้องมี { }, คำสั่ง return และ semicolon ใน ES6 ก็ได้

ดังนั้น เราก็อัพเดตโค้ดใน Gulp file ให้เป็นแบบนี้แทน

```javascript
gulp.task('lint', () =>
  gulp.src([
    paths.allSrcJs,
    paths.gulpFile,
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

gulp.task('clean', () => del(paths.libDir));

gulp.task('build', ['lint', 'clean'], () =>
  gulp.src(paths.allSrcJs)
    .pipe(babel())
    .pipe(gulp.dest(paths.libDir))
);
```

และ issue สุดท้ายที่หลงเหลือนั้นจะเกี่ยวกับ `console.log()` ซึ่งหากเราต้องการให้เราใช้ `console.log()` ใน `index.js` ได้ แทนที่จะเตือนเราในตัวอย่างนี้ คุณคงก็คงจะเดาได้ว่าต้องทำอะไร เราก็เพิ่ม `/* eslint-disable no-console */` ไว้ที่ด้านบนสุดของไฟล์ `index.js` สิ เหมือนกับที่ทำใน Gulpfile ของเรา

- สั่ง `yarn start` แล้วเราจะพบการแจ้งเตือนจาก ESLint อีกแล้ว!

**หมายเหตุ**: ในบทนี้เราใช้ ESLint ภายใน console ซึ่งดีมากเพื่อหา error ตอนที่เราทำการ build หรือก่อนที่เราจะ push โค้ดขึ้นไป แต่ก็จะเป็นการดีกว่านี้มากถ้าคุณจะใช้ ESLint ใน IDE ของคุณได้ แต่**ไม่แนะนำ**ให้ใช้ linting ตัวปกติของ IDE ในการ linting ES6 ให้ลองตั้งค่า IDE ตัวที่คุณใช้ เพื่อให้ใช้ตัว linting ที่อยู่ในโฟลเดอร์ `node_modules` เพื่อให้คุณสามารถใช้การตั้งค่าของโปรเจคที่คนอื่นๆ เขียนไว้ให้ รวมถึงใช้ preset ของ Airbnb ได้อีกด้วย หากไม่ทำแล้วคุณก็จะได้ตัว linting แบบปกติของ ES6 ไปใช้แทน

บทถัดไป [บทที่ 7 - พัฒนาแอพฝั่ง Client โดยใช้ Webpack](/tutorial/7-client-webpack)

กลับไปยัง[บทที่แล้ว](/tutorial/5-es6-modules-syntax) หรือไปที่[สารบัญ](https://github.com/MicroBenz/js-stack-from-scratch#table-of-contents)
