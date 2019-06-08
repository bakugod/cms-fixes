# React CMS 

<p>
  [![Codacy Badge](https://api.codacy.com/project/badge/Grade/429b39289716496580fe9cf6dbb6124e)](https://www.codacy.com?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=bakugod/cms-fixes&amp;utm_campaign=Badge_Grade)
</p>

## Запуск

`npm i && npm run run` or `yarn add && yarn run run`

## Деплой

```
npm i
npm run build:prod
```

В папке **dist/** появятся все файлы. В папке **/etc** есть конфиг нужный для ***nginx*** (там прокси до бэкенда). Нужно лишь в 
конфиге (при копировании в **/etc/nginx/sites-enabled/**) указать путь до **/dist**.

### Фиксы не по ТЗ
`open: process.env.WEBPACK_SERVER_BROWSER || 'Chrome'` в старой версии было 
`open: process.env.WEBPACK_SERVER_BROWSER || 'Yandex'`


