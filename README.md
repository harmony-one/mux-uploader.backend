###

`npm install`

###

`docker-compose up -d`

[comment]: <> (###)

[comment]: <> (`sequelize db:create`)

### Run migrations

`npx sequelize-cli db:migrate`

### Run migrations for test env

`NODE_ENV=test APP_ENV=test npx sequelize-cli db:migrate`

### Revert migrations

`npx sequelize-cli db:migrate:undo`
`npx sequelize-cli db:migrate:undo:all`

`npm run start`

### Sequelize + TypeScript

https://www.npmjs.com/package/sequelize-typescript

### Migrations

https://sequelize.org/docs/v6/other-topics/migrations/#dynamic-configuration
