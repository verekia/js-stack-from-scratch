# JavaScript Stack from Scratch [ฉบับแปลไทย]

[![Build Status](https://travis-ci.org/verekia/js-stack-from-scratch.svg?branch=master)](https://travis-ci.org/verekia/js-stack-from-scratch) [![Join the chat at https://gitter.im/js-stack-from-scratch/Lobby](https://badges.gitter.im/js-stack-from-scratch/Lobby.svg)](https://gitter.im/js-stack-from-scratch/Lobby)

[![Yarn](/img/yarn.png)](https://yarnpkg.com/)
[![React](/img/react.png)](https://facebook.github.io/react/)
[![Gulp](/img/gulp.png)](http://gulpjs.com/)
[![Redux](/img/redux.png)](http://redux.js.org/)
[![ESLint](/img/eslint.png)](http://eslint.org/)
[![Webpack](/img/webpack.png)](https://webpack.github.io/)
[![Mocha](/img/mocha.png)](https://mochajs.org/)
[![Chai](/img/chai.png)](http://chaijs.com/)
[![Flow](/img/flow.png)](https://flowtype.org/)

**หมายเหตุผู้แปล**: Tutorial นี้แปลมาจากต้นฉบับภาษาอังกฤษ [JavaScript Stack from Scratch](https://github.com/verekia/js-stack-from-scratch) โดยส่วนมากจะแปลและแปลงสำนวนจากคำอธิบายดั้งเดิมตรงๆ และอาจมีบางส่วนที่อธิบายเพิ่มเติมขึ้นมาเพื่อให้เห็นภาพชัดเจนมากขึ้น สำหรับใครที่ต้องการให้คำแนะนำเรื่องการแปล หรือคำอธิบายจุดไหนที่ดูเข้าใจยากแปลกๆ สามารถเพิ่ม issue ของ repo นี้ได้เลยครับ น้อมรับคำติชมทุกประการครับผม

ยินดีต้อนรับสู่ Tutorial สอนการสร้าง และใช้งานเครื่องมือต่างๆ ของภาษา JavaScript: **JavaScript Stack from Scratch**

Tutorial นี้เป็น tutorial ที่จะสอนการใช้งาน JavaScript tool ต่างๆ ด้วยกัน โดยจะสอนแบบตรงไปตรงมา อธิบายทีละจุดทีละเรื่อง ซึ่งผู้อ่านควรจะมีพื้นฐานทางด้านการเขียนโปรแกรมมาบ้าง รวมถึงรู้เบสิคของ JavaScript มาบ้าง **Tutorial นี้จะเน้นไปที่การรวมเอา tools ต่างๆ หลายๆ ตัวมาใช้งานด้วยกัน** และให้**ตัวอย่างโค้ดที่เรียบง่ายที่สุด** สำหรับในแต่ละ tool เพื่อให้นำไปใช้งานต่อได้ง่ายและเข้าใจมากขึ้น ซึ่งคุณเองก็สามารถที่จะอ่าน tutorial นี้ไปแต่ละบท *พร้อมกับสร้าง boilerplate ไว้ใช้งานเองได้ตามที่ต้องการ*

ในความเป็นจริง คุณไม่จำเป็นต้องใช้ stack แบบที่เรานำเสนอในการพัฒนา Web Page เล็กๆ ที่ไม่จำเป็นต้องมี interaction อะไรมากมาย (ถ้าโปรเจคมีขนาดเล็ก ใช้แค่ Browserify/Webpack + Babel + jQuery ก็เพียงพอแล้วในการที่เราจะเขียนโค้ดตามมาตรฐาน ES6 แต่ก็ใช้ Library เดิมๆ อย่าง jQuery ได้) แต่ถ้าคุณต้องทำ Web Apps ขนาดใหญ่ รองรับต่อการ scale ขนาดของ Web Apps รวมถึงต้องการความช่วยเหลือในการ setup tool ต่่างๆ, Tutorial นี้จะช่วยเหลือคุณได้มาก

เนื่องจากเป้าหมายของ Tutorial นี้คือจะสอนการใช้ tool หลายๆ ตัวร่วมกัน ซึ่งผมเองก็จะไม่ลงรายละเอียดว่า tools แต่ละตัวนั้นทำงานยังไง ถ้าอยากก็รู้สามารถอ่าน documentation หรือ tutorial แบบ in-depth ตัวอื่นๆ ได้ ถ้าต้องการเข้าใจการทำงานของ tools แต่ละอันมากขึ้น

ซึ่ง stack ที่จะใช้ในบทนี้นั้นจะใช้ React เป็นหลัก ซึ่งถ้าคุณอยากเรียนรู้ React โปรเจค [create-react-app](https://github.com/facebookincubator/create-react-app) นั้นก็ช่วยให้คุณ set up React environment ได้อย่างง่ายได้ โดยที่คุณไม่ต้องไป config อะไรเองเลย ซึ่งโดยส่วนตัวผมเอง(ผู้เขียน) ก็แนะนำให้ใช้ `create-react-app` สำหรับผู้มาใหม่ที่ต้องใช้ React และต้องเข้าใจเรื่องต่างๆ ให้รวดเร็วหน่อย แต่ใน Tutorial นี้ คุณไม่จำเป็นต้องใช้ config ที่ถูกตั้งค่ามาแล้วเหล่านั้น เพราะเราต้องการให้คุณเข้าใจทุกอย่างตั้งแต่แรกเริ่มไปจนถึงได้ Web Apps ออกมา

นอกจากนี้เรายังมีตัวอย่างโค้ดให้ด้วยสำหรับแต่ละบท และทุกบทนั้นสามารถ run ได้ด้วยคำสั่งง่ายๆ อย่่าง `yarn && yarn start` หรือ `npm install && npm start` ผมเองก็ขอแนะนำให้ทุกท่านเริ่มเขียนทุกอย่างเองตั้งแต่ไม่มีอะไรเลย โดย**ทำตามขั้นตอนแต่ละขั้น** ซึ่งจะอ้างอิงตาม tutorial ในแต่ละบท

**ทุกบทนั้นจะมีการอ้างถึงและใช้งานโค้ดจากบทก่อนหน้า** ดังนั้นถ้าคุณกำลังมองหา boilerplate ที่มีครบทุกอย่าง ก็ทำได้ง่ายๆ โดยการ clone โค้ดจากบทสุดท้ายมาก็พอแล้ว

หมายเหตุ: ลำดับการเรียงของบทนั้นไม่ค่อยเหมาะสมกับวิธีการเรียนแบบปกติ เช่น การทำ testing หรือ type checking ควรทำก่อนที่จะเขียน React ด้วยซ้ำ ซึ่งจะเป็นการยากหากเราจะทำการสลับบทเพื่อเรียงลำดับใหม่ เพราะยังมีการปรับแก้แต่ละบทอยู่เรื่อยๆ ซึ่งผม(ตัวผู้เขียน) ขอให้ทุกอย่างเสร็จสิ้นก่อน แล้วเราจะพิจารณาเรื่องนี้อีกทีหนึ่ง

Code ที่อยู่ใน Tutorial นี้ทำงานได้ทั้งบน Linux, macOS และ Windows

## สารบัญ

[บทที่ 1 - Node, NPM, Yarn และ package.json](/tutorial/1-node-npm-yarn-package-json)

[บทที่ 2 - ติดตั้งและใช้งาน package](/tutorial/2-packages)

[บทที่ 3 - ตั้งค่าเพื่อใช้งาน ES6 โดยใช้ Babel และ Gulp](/tutorial/3-es6-babel-gulp)

[บทที่ 4 - การใช้ ES6 syntax ในการเขียน Class](/tutorial/4-es6-syntax-class)

[บทที่ 5 - การใช้ ES6 syntax ในการสร้าง modules](/tutorial/5-es6-modules-syntax)

[บทที่ 6 - การใช้ ESLint](/tutorial/6-eslint)

[บทที่ 7 - พัฒนาแอพฝั่ง Client โดยใช้ Webpack](/tutorial/7-client-webpack)

[บทที่ 8 - React](/tutorial/8-react)

[บทที่ 9 - Redux](/tutorial/9-redux)

[บทที่ 10 - Immutable JS และ Redux Improvements](/tutorial/10-immutable-redux-improvements)

[บทที่ 11 - การทำ Testing โดยใช้ Mocha, Chai และ Sinon](/tutorial/11-testing-mocha-chai-sinon)

[บทที่ 12 - เช็ค Data Type ด้วย Flow](/tutorial/12-flow)

## เร็วๆ นี้

Production / development environments, Express, React Router, Server-Side Rendering, Styling, Enzyme, Git Hooks.

## ภาษาอื่นๆ

- [中文](https://github.com/pd4d10/js-stack-from-scratch) by [@pd4d10](http://github.com/pd4d10)
- [Italiano](https://github.com/fbertone/js-stack-from-scratch) by [Fabrizio Bertone](https://github.com/fbertone)
- [日本語](https://github.com/takahashim/js-stack-from-scratch) by [@takahashim](https://github.com/takahashim)
- [ไทย](https://github.com/MicroBenz/js-stack-from-scratch) by [MicroBenz](https://github.com/MicroBenz)

## Credits

เขียนโดย [@verekia](https://twitter.com/verekia) – [verekia.com](http://verekia.com/).

ลิขสิทธิ์: MIT
