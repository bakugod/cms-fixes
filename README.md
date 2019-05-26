# React CMS 

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
Из-за файла **Info.tsx** не работал HMR, исправил.

