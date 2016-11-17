# 7 - พัฒนาแอพฝั่ง Client โดยใช้ Webpack

## จัดโครงสร้างไฟล์ให้กับแอพของเรา

- สร้างโฟลเดอร์ชื่อ `dist` ที่ root ของโปรเจค และเพิ่มไฟล์ `index.html` ลงไปดังนี้

```html
<!doctype html>
<html>
  <head>
  </head>
  <body>
    <div class="app"></div>
    <script src="client-bundle.js"></script>
  </body>
</html>
```

ในโฟลเดอร์ `src` ให้สร้างโฟลเดอร์ย่อย `server`, `shared`, `client` และทำการย้ายไฟล์ `index.js` ไปยัง `server` และ `dog.js` ไปยัง `shared` แล้วให้ทำการสร้างไฟล์ `app.js` ไปไว้ในโฟลเดอร์ `client`

ณ ตอนนี้เราจะยังไม่ทำอะไรกับ Node back-end แต่การแบ่งโฟลเดอร์แบบนี้จะช่วยให้เราเห็นภาพว่าของแต่ละอย่างอยู่ที่ใด ดังนั้นคุณต้องแก้โค้ด `import Dog from './dog'` ใน `server/index.js` ด้วย `import Dog from '../shared/dog';` แทน ไม่เช่นนั้นแล้ว ESLint จะตรวจเจอ error ที่แจ้งว่า unresolved modules

เขียนโค้ดดังต่อไปนี้ใน `client/app.js`

```javascript
import Dog from '../shared/dog';

const browserToby = new Dog('Browser Toby');

document.querySelector('.app').innerText = browserToby.bark();
```

เพิ่ม JSON field เหล่านี้ไปใน `package.json` ข้างใน field `eslintConfig`

```json
"env": {
  "browser": true
}
```

เพื่อให้เราใช้ตัวแปร เช่น `window` หรือ `document` ที่ใช้งานบน web browser ได้ทันที โดยไม่ให้ ESLint บ่นกับเราเรื่องของตัวแปรที่ไม่โดนประกาศไว้ (undeclared variables)

ถ้าคุณต้องการใช้ฟีเจอร์ใหม่ๆ ของ ES6 ในฝั่ง client เช่น `Promise` คุณต้องเพิ่ม [Babel Polyfill](https://babeljs.io/docs/usage/polyfill/) เข้าไปในโค้ดของฝั่ง client ด้วย

- สั่ง `yarn add babel-polyfill`

และด้านบนสุดของ `app.js` ก่อนทุกๆ อย่าง ให้เพิ่ม import ด้านล่างลงไป

```javascript
import 'babel-polyfill';
```

ซึ่งการเพิ่ม polyfill นั้นจะเป็นการให้ bundle ที่คุณได้นั้นมีขนาดใหญ่ขึ้น ดังนั้นควรจะเพิ่ม polyfill เฉพาะฟีเจอร์ที่คุณต้องการใช้เท่านั้น ซึ่งในตัวอย่างบทถัดๆ ไปจะแสดงให้เห็นในเรื่องของการเพิ่ม polyfill เฉพาะที่เราต้องการ

## Webpack

ใน Node environment ทั้งหลายทั้งปวงนั้น คุณสามารถสั่ง `import` หลายๆ ไฟล์ได้ และ Node จะเป็นคนจัดหา file เหล่านั้นใน filesystem ให้เอง แต่ว่าใน web browser นั้นไม่มีระบบ filesystem ให้ใช้ ทำให้การ `import` นั้นดูเหมือนเป็นการ import ไปหาความว่างเปล่า ไม่รู้จะไปเอา module จากไหนมา ดังนั้นในการที่ไฟล์เริ่มต้นของเรา (entry point file) `app.js` ให้รู้ว่าต้องไป import อะไรมาใช้บ้าง เราจะทำการ "bundle" dependencies ทั้งหมดที่เราต้องการใช้ รวมมาเป็นไฟล์เดียว ซึ่ง Webpack เป็นเครื่องมือที่มีหน้าที่ในการทำเรื่องดังกล่าว

Webpack จะมีการใช้ config file เหมือนๆ กับ Gulp แต่มีชื่อเรียกว่า `webpack.config.js` ซึ่งแน่นอนว่าเราสามารถใช้ ES6 imports กับ exports ได้ แบบเดียวกับที่ Gulp ขอให้ Babel ช่วยจัดการให้หน่อย โดยการตั้งชื่อไฟล์เป็น `webpack.config.babel.js`

- สร้างไฟล์เปล่า `webpack.config.babel.js`

- เพิ่ม `webpack.config.babel.js` ไปใน task 'lint' ของ Gulp โดยการเพิ่มค่าเข้าไปใน constant `paths` ดังนี้

```javascript
const paths = {
  allSrcJs: 'src/**/*.js',
  gulpFile: 'gulpfile.babel.js',
  webpackFile: 'webpack.config.babel.js',
  libDir: 'lib',
  distDir: 'dist',
};

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
);
```

เราต้องสอนให้ Webpack นั้นทำการ process ES6 files โดยใช้ Babel (คล้ายกับการสอนให้ Gulp ทำการ process ES6 files โดยใช้ `gulp-babel`) ใน Webpack เมื่อเราต้องการ process ไฟล์ที่ไม่ใช่ JavaScript ธรรมดาๆ นั้น เราจะใช้สิ่งที่เรียกว่า *loaders* ในการ process ไฟล์ดังกล่าว ดังนั้น เรามาติดตั้ง Babel loader ให้กับ Webpack โดยให้

- สั่ง `yarn add --dev babel-loader`

- เขียนโค้ดดังต่อไปนี้ลงไปใน `webpack.config.babel.js`

```javascript
export default {
  output: {
    filename: 'client-bundle.js',
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
      },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
};
```

เรามาดูรายละเอียดของไฟล์นี้กัน

เราต้องการให้ไฟล์นี้ถูก `export` เพื่อให้ Webpack อ่าน โดยในส่วนของ `output.filename` นั้นจะบอกชื่อไฟล์ bundle ที่เราต้องการ

`devtool: 'source-map'` จะเป็นการเปิดใช้ source map เพื่อให้ทำการ debug บน web browser ได้ง่ายขึ้น

ใน `module.loaders` เรามี `test` ที่เขียนเป็น JavaScript regex เพื่อใช้ในการ test ว่าไฟล์ไหนที่ต้องโดน process โดย `babel-loader` ซึ่งเราต้องการให้ทั้งไฟล์ที่มีนามสกุล `.js` และ `.jsx` (สำหรับ React ในบทถัดไป) ถูก process ด้วย `babel-loader` เราจึงใส่ regex `/\.jsx?$/` ลงไป และนอกจากนี้เราต้องการให้โฟลเดอร์ `node_modules` ไม่ถูก process ด้วย จึงใส่ไว้ใน field exclude เพื่อให้เมื่อมีการ `import` package ที่อยู่ในโฟลเดอร์ `node_modules` ตัว Babel จะไม่ยุ่งกับไฟล์เหล่านั้น เพื่อลดเวลาในการ build ลงไปอีก

ใน `resolve` จะเป็นการบอก Webpack ว่าไฟล์นามสกุลไหนบ้างที่จะสามารถ `import` เข้ามาในโค้ดได้ โดยใช้ path แบบไม่ต้องระบุนามสกุล เช่น `import Foo from './foo'` โดยที่ `foo` อาจจะเป็นได้ทั้ง `foo.js` หรือ `foo.jsx` ตามที่เราบอกใน resolve

โอเค ตอนนี้เราได้ set up Webpack แล้วเรียบร้อย แต่เรายังต้องหาวิธีที่จะ*สั่งให้ Webpack ทำงาน*

## ใช้งาน Webpack คู่กับ Gulp

Webpack นั้นมีความสามารถสูงมาก สามารถทำอะไรได้เยอะแยะมากมาย จนเราอาจจะนำมันไปใช้แทน Gulp ก็ยังได้ สำหรับโปรเจคที่ทำบนฝั่ง Client เป็นหลัก แต่ Gulp นั้นเป็น tool ที่ทำงานทั่วๆ ไปได้ (เทียบกับ Webpack แล้ว Webpack จะเจาะจงสำหรับ Front-End มากกว่า) ซึ่งจะเป็นการที่ดีกว่าที่เราจะให้ Gulp เป็นคนทำ linting, รัน test หรือทำ Back-End tasks ทั้งหลายทั้งปวง และ Gulp ยังถือว่าเข้าใจง่ายกว่า Webpack config สำหรับมือใหม่ ดังนั้นการที่ให้ Webpack สามารถใช้งานผ่าน Gulp ได้จึงเป็นไอเดียที่ดี

ดังนั้น เรามาสร้าง Gulp task เพื่อให้รัน Webpack กัน เปิดไฟล์ `gulpfile.babel.js` ขึ้นมา

ตอนนี้เราไม่ต้องการให้ `main` task สั่งรัน `node lib/` อีกต่อไป เนื่องจากเราต้องการเปิด `index.html` ขึ้นมาเพื่อรันแอพแทน

- ลบ `import { exec } from 'child_process'` ออก

คล้ายๆ กับ plugin ของ Gulp package 'webpack-stream' จะช่วยให้เราใช้ Webpack ใน Gulp ได้ง่ายดายขึ้นมาก

- ติดตั้ง package ด้วยคำสั่ง `yarn add --dev webpack-stream`

- เพิ่ม `import`

```javascript
import webpack from 'webpack-stream';
import webpackConfig from './webpack.config.babel';
```

บรรทัดที่สอง จะเป็นการหยิบ config file ที่เราเขียนไว้เข้ามา

เหมือนที่ได้กล่าวไว้ข้างต้น ในบทถัดไปเราจะมีการใช้ไฟล์ `.jsx` (ในฝั่ง client รวมถึงในฝั่ง server ด้วยในอนาคต) ดังนั้น เราควรจะต้องตั้งค่าเผื่ออนาคตไว้ตั้งแต่ตอนนี้เลย ด้วยการทำตามนี้

- เปลี่ยนตัวแปร constant ให้เป็นไปตามนี้

```javascript
const paths = {
  allSrcJs: 'src/**/*.js?(x)',
  serverSrcJs: 'src/server/**/*.js?(x)',
  sharedSrcJs: 'src/shared/**/*.js?(x)',
  clientEntryPoint: 'src/client/app.js',
  gulpFile: 'gulpfile.babel.js',
  webpackFile: 'webpack.config.babel.js',
  libDir: 'lib',
  distDir: 'dist',
};
```

`.js?(x)` เป็น pattern ธรรมดาเพื่อใช้ match `.js` หรือ `.jsx` ไฟล์ได้

ดังนั้น ในตอนนี้เราจะมีตัวแปร constant เพื่อบอก path และชื่อไฟล์ต่างๆ ให้ใช้ภายในแอพของเราแล้ว

- แก้ `main` task ให้เป็นดังนี้

```javascript
gulp.task('main', ['lint', 'clean'], () =>
  gulp.src(paths.clientEntryPoint)
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(paths.distDir))
);
```

**หมายเหตุ**: task `build` ของเรานั้นจะทำการแปลงโค้ด ES6 เป็น ES5 สำหรับทุกไฟล์ที่มีนามสกุล `.js` ภายในโฟลเดอร์ `src` ซึ่งในตอนนี้เราแบ่งโค้ดออกเป็นสามส่วนคือ `server`, `shared` และ `client` ทำให้เราต้องแก้ task เพื่อให้ compile เฉพาะไฟล์ใน `server` และ `shared` เท่านั้น (เพราะ Webpack จะจัดการเรื่องของ `client` ให้แล้ว) อย่างไรก็ตาม ในบทเรื่อง Testing เราจะให้ Gulp นั้น compile โค้ดจากฝั่ง `client` ที่เป็นตัวทำ testing ด้วย ซึ่ง Webpack จะไม่ยุ่งเกี่ยวกับโค้ดของการ testing ดังนั้นจนกว่าจะไปถึงบทถัดๆ ไป โค้ดในส่วนนี้เหมือนเป็นการเขียนอะไรที่ซ้ำซ้อนจนไม่มีความจำเป็น ผม(ผู้เขียน) ต้องการให้ทุกคนเข้าใจว่านี่ไม่ใช่เรื่องร้ายแรงมากสำหรับตอนนี้ โดยเฉพาะเราจะไม่มีการใช้ task `build` และโฟลเดอร์ `lib` อีกต่อไป จนกว่าจะถึงบทดังกล่าว ดังนั้นในตอนนี้สิ่งที่เราสนใจนั้นก็คือ client bundle เท่านั้น

- สั่ง `yarn start` เราจะเห็นว่า Webpack กำลัง build ไฟล์ `client-bundle.js` เมื่อเสร็จแล้วให้เปิดไฟล์ `index.html` ขึ้นมาใน web browser เราจะเห็นคำว่า "Wah wah, I am Browser Toby" ขึ้นมา

อย่างสุดท้าย เราจะพบว่า ไฟล์ `dist/client-bundle.js` กับ `dist/client-bundle.js.map` จะไม่สามารถถูก clean ได้ด้วย task `clean` ที่เราเขียนไว้

- เพิ่ม `clientBundle: 'dist/client-bundle.js?(.map)'` ใน `paths` ของเรา และแก้ไข `clean` task ให้เป็นแบบนี้ เพื่อให้เราทำการ clean ถูกโฟลเดอร์

```javascript
gulp.task('clean', () => del([
  paths.libDir,
  paths.clientBundle,
]));
```

- เพิ่ม `/dist/client-bundle.js*` เข้าไปในไฟล์ `.gitignore`

บทถัดไป [8 - React](/tutorial/8-react)

กลับไปยัง[บทที่แล้ว](/tutorial/6-eslint) หรือไปที่[สารบัญ](https://github.com/MicroBenz/js-stack-from-scratch#table-of-contents)
