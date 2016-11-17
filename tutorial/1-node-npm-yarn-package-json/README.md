# 1 - Node, NPM, Yarn และ package.json

ในบทนี้เราจะพูดถึงการ set up Node, NPM, Yarn, และการใช้งาน `package.json` ในขั้นต้น

แรกสุด เราต้องติดตั้ง Node ก่อน ซึ่งเราจะไม่ได้ใช้ Node สำหรับการทำ Back-End ด้วย JavaScript เท่านั้น แต่เครื่องมือที่เราใช้สำหรับ Front-End ก็ใช้ Node ด้วย

ไปที่หน้า[ดาวน์โหลด](https://nodejs.org/en/download/current/) สำหรับ macOS หรือ Windows แบบ binaries หรือใช้ [package manager](https://nodejs.org/en/download/package-manager/) สำหรับ Linux

สำหรับ **Ubuntu / Debian** คุณสามารถใช้คำสั่งนี้เพื่อติดตั้ง Node ได้

```bash
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
```

ติดตั้งเวอร์ชันอะไรก็ได้ที่มากกว่า 6.5.0

`npm` เป็น package manager สำหรับ Node ซึ่งติดตั้งโดยอัตโนมัติอยู่แล้วเมื่อติดตั้ง Node ดังนั้นจึงไม่ต้องติดตั้งอะไรเพิ่ม

**Note**: ถ้าเคยติดตั้ง Node มาแล้ว ให้ติดตั้ง `nvm` ([Node Version Manager](https://github.com/creationix/nvm)) แล้วใช้ `nvm` ในการติดตั้งเวอร์ชันล่าสุดที่คุณต้องการ

[Yarn](https://yarnpkg.com/) ก็เป็น package manager เหมือนกับ NPM แต่ว่าเร็วกว่า NPM, ใช้งานแบบ Offline ได้ รวมถึงสามารถค้นหา dependencies ต่างๆ [แบบคาดเดาได้มากขึ้น](https://yarnpkg.com/en/docs/yarn-lock) ตั้งแต่ที่ Yarn [release](https://code.facebook.com/posts/1840075619545360) ออกมาเมื่อตุลาคม 2016 นั้น ก็ได้รับการตอบรับอย่างดี รวมถึงมีการ fix bug ได้รวดเร็วมาก จนกลายเป็น package manager ตัวใหม่ที่เป็นทางเลือกนอกเหนือจากการใช้ NPM ซึ่งใน Tutorial ของเรานั้นจะใช้ Yarn ทั้งหมด แต่ถ้าคุณอยากใช้ NPM เดิมๆ ก็เพียงแค่ใช้ `npm install --save` กับ `npm install --dev` แทน `yarn add` กับ `yarn add --dev` ที่อยู่ใน Tutorial นี้ทั้งหมด

- ติดตั้ง Yarn โดยทำตาม [instructions](https://yarnpkg.com/en/docs/install) ตามนี้ หรือจะสั่ง `npm install -g yarn` หรือ `sudo npm install -g yarn` ก็ได้ (ใช่แล้ว เราใช้ NPM เพื่อติดตั้ง Yarn มันก็คล้ายๆ กับใช้ Internet Explorer หรือ Safari เพื่อติดตั้ง Chrome นั้นแหละ!)

- สร้าง folder ใหม่ขึ้นมา (ชื่ออะไรก็ได้) และ `cd` เข้าไป
- สั่ง `yarn init` และตอบคำถามตามที่แสดงมา (หรือใช้ `yarn init -y` เพื่อข้ามทุกคำถามเลยก็ได้) เพื่อให้ Yarn ทำการสร้างไฟล์ `package.json` ขึ้นมาเอง
- สร้าง `index.js` แล้วเขียน `console.log('Hello world')` ในไฟล์นั้นลงไป
- สั่ง `node .` ในโฟลเดอร์ปัจจุบัน (`index.js` คือ default file ที่ Node จะมองหาในโฟลเดอร์ปัจจุบัน) เมื่อสั่งรันแล้วควรจะเห็นคำว่า "Hello world" ขึ้นมา

ซึ่งการสั่ง `node .` นั้นดูจะ low-level ไปนิด เราจะใช้ NPM/Yarn script เพื่อให้สั่งรันคำสั่งที่ว่านั้นแทน แต่จะได้ความ abstraction และเข้าใจง่ายขึ้นมาด้วย เพราะเราจะสั่งคำสั่งด้วย `yarn start` เฉยๆ เลย แม้ว่าในอนาคตตัวคำสั่งที่เราจะสั่งมันจะซับซ้อนขึ้นไปกว่านี้อีก เราก็สั่ง `yarn start` ก็พอ ซึ่งวิธีการก็ทำตามนี้

- ในไฟล์ `package.json` เพิ่ม `scripts` object เข้าไปใน root object แบบนี้

```json
"scripts": {
  "start": "node ."
}
```

ซึ่ง `package.json` ต้องเป็นไฟล์ JSON จริงๆ (ห้ามมี trailing commas) ดังนี้ระวังให้ดีเมื่อต้องแก้ไข `package.json` ด้วยมือ

- สั่ง `yarn start` ทีนี้ก็จะเห็นคำว่า `Hello world` แล้ว

- สร้าง `.gitignore` ขึ้นมา และเพิ่มข้อมูลเหล่านี้ลงไป

```gitignore
npm-debug.log
yarn-error.log
```

**Note**: ถ้าดูในไฟล์ `package.json` ที่เรามีให้ในโปรเจคนี้ จะเห็น script `tutorial-test` ในทุกๆ บทเลย ซึ่ง script นี้จะช่วยให้ผม(ผู้เขียน) เทสว่าโค้ดในบทนี้ใช้งานได้ เมื่อทำการรัน `yarn && yarn start` ดังนั้น คุณสามารถลบ script นี้ทิ้งได้เลยในโปรเจคของคุณเอง

บทถัดไป [2 - ติดตั้งและใช้งาน package](/tutorial/2-packages)

กลับไปที่[สารบัญ](https://github.com/MicroBenz/js-stack-from-scratch#table-of-contents)
