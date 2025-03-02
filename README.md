# Education Connection BE

## Description

Education Connection is a back-end application that helps teachers perform administrative functions for their students, built using the [NestJS](https://nestjs.com/) framework.

## Features

- Teacher can register one or more students to a specified teacher
- Teacher can retrieve a list of students common to a given list of teachers
- Teacher can suspend a specified student
- Teacher can retrieve a list of students who can receive a given notification

## Pre-requisites

- Node.js v22.12.0
- Docker
- Postman

## Project setup

```bash
$ yarn install
```

## Environment setup

To run this project, you will need to create a `.env` file in the root directory by copying the `.env.template` file.

```bash
$ cp .env.template .env
```

Inside `.env` file, you can setup by your own or you can use the following environment variables:

```plaintext
PORT=3000

DB_HOST=db
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=admin@ec
DB_NAME=education_connection

MYSQL_PORT=3307
MYSQL_ROOT_PASSWORD=root@ec
MYSQL_USER=admin
MYSQL_PASSWORD=admin@ec
MYSQL_DATABASE=education_connection
```

## Compile and run the project

DB_HOST should be changed to localhost if you want to run the project locally.

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

Or simply run the `docker-compose` command to run the project in a Docker container.

```bash
$ docker-compose up
```

## Migrations and Seeds

```bash
# generate migrations
$ yarn run migration:generate src/database/migrations/<migration-name>

# run migrations
$ yarn run migration:run

# revert migrations
$ yarn run migration:revert

# run seeds
$ yarn run seed
```

To run the migrations and seeds in Docker container, run the above commands with prefix
`docker-compose exec builder <command>`.

## Run tests

```bash
# unit tests
$ yarn run test

# test coverage
$ yarn run test:cov
```

## Run linting

```bash
$ yarn run lint
$ yarn run format
```

## Note

- [Postman File](./education-connection.postman_collection.json) is available for testing purposes.
