### Get started

#### Copy and .env file

`cp .env.template .env`

#### Install packages

`npm install`

#### Start docker compose 

`docker-compose up -d`

#### Create database

`npx sequelize db:create`

#### Run migrations

`npx sequelize-cli db:migrate`

#### Run application

`npm run start:dev`



### Sequelize + TypeScript

https://www.npmjs.com/package/sequelize-typescript

### Migrations

#### Docs
https://sequelize.org/docs/v6/other-topics/migrations/#dynamic-configuration

### Revert migrations

`npx sequelize-cli db:migrate:undo`
`npx sequelize-cli db:migrate:undo:all`


### Build for production or test env

```
npm run build
docker build . --platform linux/amd64 -t ahiipsa/shorts-reels-videos.backend:0.0.1
docker push ahiipsa/shorts-reels-videos.backend:0.0.1 
```

#### Copy .env to project root dir