# JavaScript Stack from Scratch

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

ยินดีต้อนรับสู่ Tutorial สอนใช้งาน Modern JavaScript: **JavaScript Stack from Scratch**.

Welcome to my modern JavaScript stack tutorial: **JavaScript Stack from Scratch**.


This is a minimalistic and straight-to-the-point guide to assembling a JavaScript stack. It requires some general programming knowledge, and JavaScript basics. **It focuses on wiring tools together** and giving you the **simplest possible example** for each tool. You can see this tutorial as *a way to write your own boilerplate from scratch*.

ในความเป็นจริง คุณไม่จำเป็นต้องใช้ stack แบบที่เรานำเสนอในการพัฒนา Web Page เล็กๆ ที่ไม่จำเป็นต้องมี interaction อะไรมากมาย (ถ้าโปรเจคมีขนาดเล็ก ใช้แค่ Browserify/Webpack + Babel + jQuery ก็เพียงพอแล้วในการที่เราจะเขียนโค้ด ES6 แต่ก็ใช้ Library เดิมๆ อย่าง jQuery ได้) แต่ถ้าคุณต้องทำ Web Apps ขนาดใหญ่ รองรับต่อการ scale ขนาดของ Web Apps รวมถึงต้องการความช่วยเหลือในการ setup ต่่างๆ, Tutorial นี้จะช่วยเหลือคุณได้มาก

You don't need to use this entire stack if you build a simple web page with a few JS interactions of course (a combination of Browserify/Webpack + Babel + jQuery is enough to be able to write ES6 code in different files with CLI compilation), but if you want to build a web app that scales, and need help setting things up, this tutorial will work great for you.

เนื่องจากเป้าหมายของ Tutorial นี้คือการใช้ tools หลายๆ ตัวร่วมกัน ซึ่งผมเองก็จะไม่ลงรายละเอียดว่า tools แต่ละตัวนั้นทำงานยังไง ถ้าอยากก็รู้สามารถอ่าน documentation หรือ tutorial แบบ in-depth ตัวอื่นๆ ได้ ถ้าต้องการเข้าใจการทำงานของ tools แต่ละอันมากขึ้น

Since the goal of this tutorial is to assemble various tools, I do not go into details about how these tools work individually. Refer to their documentation or find other tutorials if you want to acquire deeper knowledge in them.

A big chunk of the stack described in this tutorial uses React. If you are beginning and just want to learn React, [create-react-app](https://github.com/facebookincubator/create-react-app) will get you up and running with a React environment very quickly with a premade configuration. I would for instance recommend this approach to someone who arrives in a team that's using React and needs to catch up with a learning playground. In this tutorial you won't use a premade configuration, because I want you to understand everything that's happening under the hood.

นอกจากนี้เรายังมีตัวอย่างโค้ดให้ด้วยสำหรับแต่ละบท และทุกบทนั้นสามารถ run ได้ด้วยคำสั่งง่ายๆ อย่่าง `yarn && yarn start` หรือ `npm install && npm start` ผมเองก็ขอแนะนำให้ทุกท่านเริ่มเขียนทุกอย่างเองตั้งแต่ไม่มีอะไรเลย โดย**ทำตามขั้นตอนแต่ละขั้น** ซึ่งจะอ้างอิงตาม tutorial ในแต่ละบท

Code examples are available for each chapter, and you can run them all with `yarn && yarn start` or `npm install && npm start`. I recommend writing everything from scratch yourself by following the **step-by-step instructions** of each chapter.

**ทุกบทนั้นจะมีการอ้างถึงและใช้งานโค้ดจากบทก่อนหน้า** ดังนั้นถ้าคุณกำลังมองหา boilerplate ที่มีครบทุกอย่าง ก็ทำได้ง่ายๆ โดยการ clone โค้ดจากบทสุดท้ายมาก็พอแล้ว

**Every chapter contains the code of previous chapters**, so if you are simply looking for a boilerplate project containing everything, just clone the last chapter and you're good to go.

Note: ลำดับการเรียงของบทนั้นไม่ค่อยเหมาะสมกับวิธีการเรียนแบบปกติ เช่น การทำ testing หรือ type checking ควรทำก่อนที่จะเขียน React ด้วยซ้ำ ซึ่งจะเป็นการยากหากเราจะทำการสลับบทเพื่อเรียงลำดับใหม่ เพราะยังมีการปรับแก้แต่ละบทอยู่เรื่อยๆ ซึ่งผม(ตัวผู้เขียน) ขอให้ทุกอย่างเสร็จสิ้นก่อน แล้วเราจะพิจารณาเรื่องนี้อีกทีหนึ่ง

Note: The order of chapters is not necessarily the most educational. For instance, testing / type checking could have been done before introducing React. It is quite difficult to move chapters around or edit past ones, since I need to apply those changes to every following chapter. If things settle down, I might reorganize the whole thing in a better way.

Code ที่อยู่ใน Tutorial นี้ทำงานได้ทั้งบน Linux, macOS และ Windows

## สารบัญ

[1 - Node, NPM, Yarn, and package.json](/tutorial/1-node-npm-yarn-package-json)

[2 - ติดตั้งและใช้งาน package](/tutorial/2-packages)

[3 - ตั้งค่าเพื่อใช้งาน ES6 โดยใช้ Babel และ Gulp](/tutorial/3-es6-babel-gulp)

[4 - การใช้ ES6 syntax ในการเขียน Class](/tutorial/4-es6-syntax-class)

[5 - การใช้ ES6 syntax ในการสร้าง modules](/tutorial/5-es6-modules-syntax)

[6 - การใช้ ESLint](/tutorial/6-eslint)

[7 - พัฒนาแอพฝั่ง Client โดยใช้ Webpack](/tutorial/7-client-webpack)

[8 - React](/tutorial/8-react)

[9 - Redux](/tutorial/9-redux)

[10 - Immutable JS and Redux Improvements](/tutorial/10-immutable-redux-improvements)

[11 - การทำ Testing โดยใช้ Mocha, Chai และ Sinon](/tutorial/11-testing-mocha-chai-sinon)

[12 - เช็ค Data Type ด้วย Flow](/tutorial/12-flow)

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
