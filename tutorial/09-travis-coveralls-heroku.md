# 09 - Travis, Coveralls и Heroku

Кода за тази глава можете да намерите в `master` клона на [JS-Stack-Boilerplate repository](https://github.com/verekia/js-stack-boilerplate).

В тази глава използвам услуги, предоставяни от трети страни, в нашето приложение. Тези услуги се предлагат с безплатни и с платени планове. Ще бъде малко противоречиво да използвам такъв тип услуги в това ръководство,  тъй като то разчита главно на community-driven и безплатни инструменти с отворен код, поради което поддържам 2 различни клона на [JS-Stack-Boilerplate repository](https://github.com/verekia/js-stack-boilerplate), `master` и `master-no-services`.

## Travis

> 💡 **[Travis CI](https://travis-ci.org/)** е популярна continuous integration платформа, безплатна за проекти с отворен код.

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

Всичко зелено ли е в Travis и Coveralls? Чудесно, покажете го на света като използвате т.нар. *значки*!

За да постигнете това можете да използвате директно кода от Travis или Coveralls, или да използвате услуга като [shields.io](http://shields.io/), за да уеднаквите или персонализирате вашите значки. Нека да използваме shields.io тук.

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

We are going to let Heroku take care of transpiling our ES6/Flow code with Babel, and generate client bundles with Webpack. But since these are `devDependencies`, Yarn won't install them in a production environment like Heroku. Let's change this behavior with the `NPM_CONFIG_PRODUCTION` env variable.

- In both apps, under Settings > Config Variables, add `NPM_CONFIG_PRODUCTION` set to `false`.

- Create a Pipeline, and grant Heroku access to your Github.

- Add both apps to the pipeline, make the staging one auto-deploy on changes in `master`, and enable Review Apps.

Alright, let's prepare our project for a deployment to Heroku.

### Running in production mode locally

- Create a `.env` file containing:

```.env
NODE_ENV='production'
PORT='8000'
```

That's in this file that you should put your local-only variables and secret variables. Don't commit it to a public repository if your project is private.

- Add `/.env` to your `.gitignore`

- Create a `Procfile` file containing:

```Procfile
web: node lib/server
```

That's where we specify the entry point of our server.

We are not going to use PM2 anymore, we'll use `heroku local` instead to run in production mode locally.

- Run `yarn remove pm2`

- Edit your `prod:start` script in `package.json`:

```json
"prod:start": "heroku local",
```

- Remove `prod:stop` from `package.json`. We don't need it anymore since `heroku local` is a hanging process that we can kill with Ctrl+C, unlike `pm2 start`.

🏁 Run `yarn prod:build` and `yarn prod:start`. It should start your server and show you the logs.

### Deploying to production

- Add the following line to your `scripts` in `package.json`:

```json
"heroku-postbuild": "yarn prod:build",
```

`heroku-postbuild` is a task that will be run every time you deploy an app to Heroku.

You will also probably want to specify a specific version of Node or Yarn for Heroku to use.

- Add this to your `package.json`:

```json
"engines": {
  "node": "7.x",
  "yarn": "0.20.3"
},
```

- Create an `app.json` file containing:

```json
{
  "env": {
    "NPM_CONFIG_PRODUCTION": "false"
  }
}
```

This is for your Review Apps to use.

You should now be all set to use Heroku Pipeline deployments.

🏁 Create a new git branch, make changes and open a Github Pull Request to instantiate a Review App. Check your changes on the Review App URL, and if everything looks good, merge your Pull Request with `master` on Github. A few minutes later, your staging app should have been automatically deployed. Check your changes on the staging app URL, and if everything still looks good, promote staging to production.

You are done! Congratulations if you finished this entire tutorial starting from scratch.

You deserve this emoji medal: 🏅

Back to the [previous section](08-bootstrap-jss.md#readme) or the [table of contents](https://github.com/verekia/js-stack-from-scratch#table-of-contents).
