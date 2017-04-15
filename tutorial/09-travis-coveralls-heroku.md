# 09 - Travis, Coveralls и Heroku

Кода за тази глава можете да намерите в `master` клона на [JS-Stack-Boilerplate repository](https://github.com/verekia/js-stack-boilerplate).

В тази глава използвам услуги, предоставяни от трети страни, в нашето приложение. Тези услуги се предлагат с безплатни и с платени планове. Ще бъде малко противоречиво да използвам такъв тип услуги в това ръководство,  тъй като то разчита главно на community-driven и безплатни инструменти с отворен код, поради което поддържам 2 различни клона на [JS-Stack-Boilerplate repository](https://github.com/verekia/js-stack-boilerplate), `master` и `master-no-services`.

## Travis

> 💡 **[Travis CI](https://travis-ci.org/)** е популярна платформа за постоянна интеграция (continuous integration), безплатна за проекти с отворен код.

Ако вашият проект е публично достъпен в Github, интеграцията с Travis е много лесна. Идентифицирайте се с вашия Github акаунт в Travis и добавете вашето репозитори.

- След това създайте `.travis.yml` файл, съдържащ:

```yaml
language: node_js
node_js: node
script: yarn test && yarn prod:build
```

Travis ще засече автоматично, че използвате Yarn, защото имате `yarn.lock` файл. Всеки път когато запазвате кода си във вашето Github репозитори, той ще стартира `yarn test && yarn prod:build`. Ако всичко е наред, би трябвало билдът ви да е успешен (you should get a green build).

## Coveralls

> 💡 **[Coveralls](https://coveralls.io)** е услуга, която ви предоставя възможност да виждате историята и статистиките на тестовото покритие (test coverage) на вашето приложение.

Ако вашият проект е с отворен код в Github и е съвместим с услугите за постоянна интеграция (Continuous Integration services) на Coveralls, единственото нещо, което трябва да направите е да свържете файла с информацията за обхвата на тестовете (coverage file), генериран от Jest, с `coveralls`.

- Изпълнете `yarn add --dev coveralls`

- Редактирайте скриптовата инструкция в `.travis.yml`, както следва:

```yaml
script: yarn test && yarn prod:build && cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js
```

Сега, всеки път когато Travis изпълнява процедурата по построяване на проекта (build), автоматично ще предава информацията от Jest тестовете на Coveralls.

## Badges

Всичко ли е зелено в Travis и Coveralls? Чудесно, покажете го на света като използвате т.нар. *значки*!

За да постигнете това можете да използвате директно кода от Travis или Coveralls, или да използвате услуга като [shields.io](http://shields.io/), за да уеднаквите или персонализирате вашите значки. Нека тук да използваме shields.io.

- Създайте или редактирайте вашия `README.md` файл, както следва:

```md
[![Build Status](https://img.shields.io/travis/GITHUB-USERNAME/GITHUB-REPO.svg?style=flat-square)](https://travis-ci.org/GITHUB-USERNAME/GITHUB-REPO)
[![Coverage Status](https://img.shields.io/coveralls/GITHUB-USERNAME/GITHUB-REPO.svg?style=flat-square)](https://coveralls.io/github/GITHUB-USERNAME/GITHUB-REPO?branch=master)
```

Разбира се, заместете `GITHUB-USERNAME/GITHUB-REPO` с вашите данни от Github акаунта ви.

## Heroku

> 💡 **[Heroku](https://www.heroku.com/)** е [PaaS](https://en.wikipedia.org/wiki/Platform_as_a_service), на която можете да публикувате вашите проекти. Тя се грижи за подробностите по инфраструктурата, така че вие да можете да се съсредоточите върху разработката без да се притеснявате како се случва зад сцената.

Това ръководство не е спонсорирано по никакъв начин от Heroku, на тъй като Heroku е една наистина добра платформа, ще ви покажа как да публикувате вашето приложение на нея. Да, това е онзи тип любов, която получавате безплатно, когато създадете един страхотен продукт.

**Забележка**: На по-късен етап може да добавя AWS секция в тази глава, но нека да караме нещата едно по едно.

### Web настройка (setup)

- Ако още не сте го направили, инсталирайте [Heroku CLI](https://devcenter.heroku.com/articles/getting-started-with-nodejs) и влезте в системата (log in).

- Отидете във вашия [Heroku Dashboard](https://dashboard.heroku.com/) и създайте 2 приложения, едното кръстете `your-project`, а другото `your-project-staging` например.

Работата по превеждането на нашия ES6/Flow код с Babel и генерирането на клиентските пакети с Webpack ще оставим на Heroku. Но тъй като това са `devDependencies`, Yarn няма да ги инсталира ако сме в производствена среда, както Heroku би направил. Нека да променим това поведение чрез променливата `NPM_CONFIG_PRODUCTION`.

- В двете приложения, в Settings > Config Variables, добавете `NPM_CONFIG_PRODUCTION` да е равна на `false`.

- Създайте Pipeline и дайте достъп на Heroku до вашия Github акаунт.

- Добавете двете приложения в pipeline-а, направете приложението -staging да се публикува автоматично при промени в `master` (auto-deploy) и включете опцията Review Apps.

Нека сега подготвим нашия проект за публикуване в Heroku.

### Running in production mode locally

- Създайте `.env` файл, съдържащ:

```.env
NODE_ENV='production'
PORT='8000'
```

В този файл трябва да слагате само вашите локални променливи или променливи с пароли. Не го публикувайте в публични репозиторита ако проектът ви е частен.

- Добавете `/.env` във вашия `.gitignore` файл.

- Създайте `Procfile` файл, съдържащ:

```Procfile
web: node lib/server
```

Това е мястото където указваме началната точка на нашия сървър.

Повече няма да използваме PM2, вместо това ще използваме `heroku local`, за да работим в "производствен режим" (production mode) локално.

- Изпълнете `yarn remove pm2`

- Редактирайте `prod:start` скрипта в `package.json`:

```json
"prod:start": "heroku local",
```

- Изтрийте `prod:stop` от `package.json`. Няма да имаме нужда повече от това, тъй като `heroku local` е непрекъснат процес, който прекратяваме с Ctrl+C, за разлика от `pm2 start`.

🏁 Изпълнете `yarn prod:build` и `yarn prod:start`. Това би трябвало да стартира вашия сървър и да ви покаже логовете.

### Публикуване в производствена среда (Deploying to production)

- Добавете следния ред в `scripts` в `package.json`:

```json
"heroku-postbuild": "yarn prod:build",
```

`heroku-postbuild` е задача, която ще бъде стартирана всеки път когато публикувате приложение в Heroku.

Също така може би ще желаете да укажете точно определени версии на Node или Yarn, които да бъдат използвани от Heroku.

- Добавете това във вашия `package.json` файл:

```json
"engines": {
  "node": "7.x",
  "yarn": "0.20.3"
},
```

- Създайте `app.json` файл, съдържащ:

```json
{
  "env": {
    "NPM_CONFIG_PRODUCTION": "false"
  }
}
```

Това ще се използва от Review Apps.

Сега вече би трябвало да сте готови да използвате Heroku Pipeline deployments.

🏁 Създайте нов git клон (branch), направете някакви промени и създайте Github Pull Request, за да инстанцирате Review App. Проверете промените си чрез Review App URL адреса и ако всичко изглежда добре, вмъкнете промените от вашия Pull Request в `master` в Github. Няколко минути по-късно вашето staging приложение трябва да беде публикувано автоматично. Проверете вашите промени на staging app URL адреса и ако всичко все още е наред, стартирайте процедурата за публикуване на приложението в производствена среда (promote staging to production).

Това беше! Моите поздравления ако сте стигнали до тук и сте направили всеки урок от това ръководство от нулата!.

Заслужавате този emoji медал: 🏅

Назад към [предишната глава](08-bootstrap-jss.md#readme) или към [съдържанието](https://github.com/mihailgaberov/js-stack-from-scratch#Съдържание).
