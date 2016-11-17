# 11 - การทำ Testing โดยใช้ Mocha, Chai และ Sinon

## Mocha และ Chai

- สร้างโฟลเดอร์ `src/test` ขึ้นมา โฟลเดอร์นี้จะเป็นเหมือนกระจกของโฟลเดอร์ที่มีแอพของเรา ดังนั้นให้สร้างโฟลเดอร์ `src/test/client` ขึ้นมาด้วย (ซึ่งคุณสามารถสร้างโฟลเดอร์ `server` และ `shared` ขึ้นมาด้วยก็ได้ แต่เราจะยังไม่เขียน test ให้กับไฟล์เหล่านั้นในตอนนี้)

- ใน `src/test/client` สร้างไฟล์ `state-test.js` ขึ้นมา โดยเราจะใช้ไฟล์นี้ในการ test Redux life cycle

เราจะใช้ [Mocha](http://mochajs.org/) สำหรับเป็น testing framework ตัวหลักของเรา Mocha นั้นใช้งานง่ายมาก พร้อมทั้งมีฟีเจอร์หลากหลาย แถมยังเป็น [JavaScript testing framework ที่ได้รับความนิยมสูงสุด](http://stateofjs.com/2016/testing/)อีกด้วย รวมถึงยังมีความยืดหยุ่นสูง Mocha สามารถให้เราใช้ assertion library ที่เราอยากใช้ได้ โดยเราจะใช้ [Chai](http://chaijs.com/) เป็น assertion library ที่มี [plugins](http://chaijs.com/plugins/) ให้ใช้เยอะมาก ตามสไตล์ของการเขียน assertion ที่เราชอบ

- มาทำการติดตั้ง Mocha และ Chai โดยสั่ง `yarn add --dev mocha chai`

ในไฟล์ `state-test.js` เขียนโค้ดต่อไปนี้

```javascript
/* eslint-disable import/no-extraneous-dependencies, no-unused-expressions */

import { createStore } from 'redux';
import { combineReducers } from 'redux-immutable';
import { should } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import dogReducer from '../../client/reducers/dog-reducer';
import { makeBark } from '../../client/actions/dog-actions';

should();
let store;

describe('App State', () => {
  describe('Dog', () => {
    beforeEach(() => {
      store = createStore(combineReducers({
        dog: dogReducer,
      }));
    });
    describe('makeBark', () => {
      it('should make hasBarked go from false to true', () => {
        store.getState().getIn(['dog', 'hasBarked']).should.be.false;
        store.dispatch(makeBark());
        store.getState().getIn(['dog', 'hasBarked']).should.be.true;
      });
    });
  });
});
```

เอาล่ะ เรามาดูกันทีละส่วนของทั้งหมดนี้

แรกสุด ให้ดูว่าเราทำการ import `should` assertion style มาจาก `chai` ซึ่งทำให้เราสามารถตรวจสอบค่าได้โดยใช้ syntax แบบ `mynumber.should.equal(3)` ซึ่งอ่าน-เขียนเข้าใจได้ง่าย เพื่อที่จะเรียกใช้ `should` กับ object อะไรก็ได้ เราจึงต้องเรียก function `should()` ก่อนที่จะทำทุกๆ อย่าง ซึ่งการทำ assertion บางอันนั้นจะเขียนเป็น *expressions* เช่น `mybook.should.be.true` ได้เหมือนกัน ทำให้บางที ESLint อาจจะเข้าใจผิดว่าเราเขียนผิดกฎ จึงต้องมีการ comment ที่ด้านบนสุดของโค้ดเพื่อปิดการใช้กฎ `no-unused-expressions` สำหรับไฟล์นี้

การทำเทสด้วย Mocha จะทำงานคล้ายๆ กับ tree อย่างในเคสนี้ เราจะเขียนเทส function `makeBark` ที่ควรจะมีผลต่อ attribute `dog` ใน application state ของเรา ดังนั้น จึงมีความ make sense ที่เราจะเขียน test โดยเช็คตามนี้ `App State > Dog > makeBark` โดยเราจะประกาศการเทส โดยใช้คำสั่ง `descrive()` และ `it()` ซึ่งจะเป็นส่วนที่จะเกิดการเทสจริงๆ ส่วนฟังก์ชัน `beforeEach()` นั้น จะเป็นฟังก์ชันที่ถูกเรียกก่อนที่จะเทสผ่านฟังก์ชัน `it()` ในกรณีนี้เราต้องการ store อันใหม่เอี่ยมก่อนจะทำการรันเทสในแต่ละอัน เราจึงประกาศตัวแปร `store` ขึ้นมาอยู่ด้านบนสุด (หลัง `should()`) เพราะเราต้องใช้ store ในทุกการเทสของไฟล์นี้

การเทสฟังก์ชัน `makeBark` ของเราจะชัดเจนที่สุด และเราสามารถอธิบายได้ว่าเทสเคสนี้ต้องการทดสอบอะไรโดยใส่เป็น string ภายในฟังก์ชัน `it()` เพื่อบอกว่าเทสเคสนี้ ตัวแปร `hasBarked` จะต้องเปลี่ยนจาก `false` เป็น `true` หลังจากมีการเรียก `makeBark`

เอาหล่ะ เมื่อเราเขียนเทสเสร็จแล้ว เรามารันเทสกันเถอะ

- ใน `gulpfile.babel.js` สร้าง task `test` ดังต่อไปนี้ โดยมีการใช้ plugin `gulp-mocha` ด้วย

```javascript
import mocha from 'gulp-mocha';

const paths = {
  // [...]
  allLibTests: 'lib/test/**/*.js',
};

// [...]

gulp.task('test', ['build'], () =>
  gulp.src(paths.allLibTests)
    .pipe(mocha())
);
```

- สั่ง `yarn add --dev gulp-mocha`

โดยทั้งนี้ไฟล์ test ที่เราจะนำมารันนั่นจะต้องถูก compile เสร็จแล้วอยู่ในโฟลเดอร์ `lib` นี่คือเหตุผลว่าทำไม task `build` จึงต้องถูกทำก่อนเมื่อสั่งงาน task `test` โดย task `build` เองก็ต้องสั่งงาน task `lint` ก่อนเช่นกัน และท้ายที่สุด เราจะให้ task `test` ถูกทำงานก่อน task `main` ด้วย ซึ่งทำให้ภาพรวมสุดท้ายสำหรับ `default` task จะเป็นดังนี้

`lint` > `build` > `test` > `main`

นั่นคือก่อนที่จะสั่งรันแอพเราได้ จะต้องผ่านการ linting ก่อน แล้วทำการ compile โค้ด ES6 เป็น ES5 จากนั้นก็จะทำการรัน test เมื่อผ่านแล้วเราจะสามารถสั่งรันแอพได้

- เปลี่ยน prerequisite task (task ที่จะถูกทำก่อน) ของ `main` ให้เป็น `test` ดังนี้

```javascript
gulp.task('main', ['test'], () => /* ... */ );
```

- ในไฟล์ `package.json` แทน script `"test"` เดิมด้วย `"test": "gulp test"` เมื่อทำอย่างนี้แล้ว เราสามารถสั่ง `yarn test` เพื่อทำการรัน test ที่เราเขียนไว้ได้ นอกจากนี้ `test` ยังเป็น standard script ที่จะถูกรันโดยอัตโนมัติ เมื่อใช้เครื่องมืออย่างเช่น CI (Continuous Integration) ดังนั้นทำให้เราควรผูก script การ test ไว้กับ script `test` ตลอด เพราะเวลาเราสั่ง `yarn start` เองก็จะมีการรัน test ก่อนที่จะ build โดยใช้ Webpack เหมือนกัน ดังนั้นมันจะถูก build ก็ต่อเมื่อ test ผ่านแล้วเท่านั้น

- สั่ง `yarn test` หรือ `yarn start` จะเห็นผลของการ test (คาดหวังว่าจะเจอแต่สีเขียวคือผ่านทั้งหมดนะ)

## Sinon

ในบางกรณี เราต้องการที่จะ *fake* บางสิ่งอย่างใน unit test ตัวอย่างเช่น สมมติเรามีฟังก์ชัน `deleteEverything` ที่จะเรียกใช้ฟังก์ชัน `deleteDatabases()` ซึ่งการสั่ง `deleteDatabases()` จะก่อให้เกิด side-effect จำนวนมาก (เช่น เผลอไปลบ Database จริงๆ ที่มี) ซึ่งเป็นสิ่งเราไม่ต้องการให้เกิดขึ้นตอนที่เราทำเทสแน่นอน

[Sinon](http://sinonjs.org/) เป็น testing library ที่มีสิ่งที่เรียกว่า **Stubs** (และอื่นๆ อีกมากมาย) ที่จะช่วยให้ฟังก์ชัน `deleteDatabases` นั้นถูก "neutralize" (ลบล้างการทำงาน) ไปก่อน และ monitor ขึ้นมาดูการทำงานของมันแทน ทำให้เราสามารถเทสสิ่งที่จะถูกเรียกมา รวมถึงพารามิเตอร์ที่ใช้ได้ด้วย ทำให้ Sinon นั้นมีประโยชน์กับการ fake หรือ หลีกเลี่ยงการทำ AJAX calls ตรงๆ ซึ่งอาจก่อให้เกิด side-effects กับ back-end ได้

เพื่อให้เห็นภาพมากขึ้น ในแอพของเรา เราจะเพิ่มฟังก์ชัน `barkInConsole` เข้าไปในคลาส `Dog` ของเราที่อยู่ใน `src/shared/dog.js` โดยมีโค้ดตามนี้

```javascript
class Dog {
  constructor(name) {
    this.name = name;
  }

  bark() {
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

เมื่อเรารัน `barkInConsole` ใน unit test `console.log()` จะทำการแสดงผลข้อความขึ้นมาใน terminal ซึ่งเราจะถือว่าการทำแบบนี้จะก่อให้เกิด side-effect ที่เราไม่ต้องการในแง่มุมของการทำ unit test เราสนใจว่า `console.log()` *จะถูกเรียกใช้จริงๆ แน่นอน* หลังจากสั่ง `barkInConsole` และเรายัง้องการเทสว่าพารามิเตอร์ใดจะเป็นคนที่ *โดนใส่มาตอนที่มีการเรียกใช้ฟังก์ชันดังกล่าว*

ทำให้ในเคสนี้ เราต้อง expect ว่า (1) `console.log()` จะถูกเรียก และ (2) พารามิเตอร์ที่อยู่ใน `console.log()` จะต้องตรงกับที่ `this.bark()` return ออกมาให้ ซึ่งทำได้ดังนี้

- สร้างไฟล์ใหม่ `src/test/shared/dog-test.js` ขึ้นมา และเขียนโค้ดตามนี้

```javascript
/* eslint-disable import/no-extraneous-dependencies, no-console */

import chai from 'chai';
import { stub } from 'sinon';
import sinonChai from 'sinon-chai';
import { describe, it } from 'mocha';
import Dog from '../../shared/dog';

chai.should();
chai.use(sinonChai);

describe('Shared', () => {
  describe('Dog', () => {
    describe('barkInConsole', () => {
      it('should print a bark string with its name', () => {
        stub(console, 'log');
        new Dog('Test Toby').barkInConsole();
        console.log.should.have.been.calledWith('Wah wah, I am Test Toby');
        console.log.restore();
      });
    });
  });
});
```

ในจุดนี้เรามีการใช้ *stubs* ของ Sinon และใช้ plugin ของ Chai ในการทำ assertion กับ Sinon stubs และอื่นๆ ด้วย

- สั่งรัน `yarn add --dev sinon sinon-chai` เพื่อทำการติดตั้ง package ดังกล่าว

โอเค ทีนี้มาดูก่อนว่ามีอะไรแปลกใหม่บ้าง แรกสุดเลย เรามีการใช้คำสั่ง `chai.use(sinonChai)` เพื่อเรียกใช้งาน plugin ของ Chai ขึ้นมา ถัดจากนั้น ความวิเศษของ Sinon ก็เริ่มโผล่มาใน `it()` เช่น `stub(console, `log`)` นั้นจะทำการ "neutralize" (ลบล้างการทำงานจริงๆ) `console.log` ไปก่อน และทำการ monitor มัน เมื่อคำสั่ง `new Dog('Test Toby').barkInConsole()` ถูกเรียก คำสั่ง `console.log` นั้นจะถูกรันขึ้นมาเป็นเรื่องปกติ เราเทสการเรียกใช้งาน `console.log` ด้วย `console.log.should.have.been.calledWith()` (ถูกเรียกจริงหรือไม่) และท้ายสุด เราทำการ `restore` การถูก neutralized ของ `console.log` ออกไป และให้มันกลับมาทำงานเหมือนเดิมตามปกติ

**สำคัญต้องอ่าน**: การทำ Stub กับ `console.log` ไม่เป็นที่แนะนำ เพราะหาก test fail ขึ้นมา `console.log.restore()` จะไม่ถูกเรียกเลย ทำให้ `console.log` จะพังไปตลอด จนเราจะไม่เห็น error message รวมถึงการแสดงผลธรรมดาใดๆ ได้อีกเลย ดังนั้นผม(ผู้เขียน) จึงขอให้เป็นการแนะนำขั้นต้นไว้ก่อนว่าอาจจะเกิดเหตุการณ์นี้ขึ้นได้ ซึ่งท่านอาจจะงงๆ ว่าทำไมถึงยกตัวอย่างนี้มา แต่ตัวอย่างนี้เป็นตัวอย่างที่ดีที่สุดแล้วสำหรับแอพที่เรียบง่ายที่เราใช้

ถ้าทุกอย่างเป็นไปตามที่ปกติในบทนี้ คุณจะได้ 2 passing test ในขั้นสุดท้าย

บทถัดไป [12 - เช็ค Data Type ด้วย Flow](/tutorial/12-flow)

กลับไปยัง[บทที่แล้ว](/tutorial/10-immutable-redux-improvements) หรือไปที่[สารบัญ](https://github.com/MicroBenz/js-stack-from-scratch#table-of-contents)
