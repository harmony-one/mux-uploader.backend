###

`npm install`

###

`docker-compose up -d`

[comment]: <> (###)

[comment]: <> (`npx sequelize db:create`)

### Run migrations

`npx sequelize-cli db:migrate`

### Run migrations for test env

`NODE_ENV=test APP_ENV=test npx sequelize-cli db:migrate`

### Revert migrations

`npx sequelize-cli db:migrate:undo`
`npx sequelize-cli db:migrate:undo:all`

### Sequelize + TypeScript

https://www.npmjs.com/package/sequelize-typescript

### Migrations

https://sequelize.org/docs/v6/other-topics/migrations/#dynamic-configuration


### Build

```
npm run build
docker build . -t <username>/<imagename>
docker build . --platform linux/amd64 -t ahiipsa/shorts-reels-videos.backend:0.0.1
docker push ahiipsa/shorts-reels-videos.backend:0.0.1
docker-compose --file docker-compose.prod.yml up 
```