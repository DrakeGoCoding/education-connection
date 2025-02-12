# Education Connection BE

## Description

Education Connection is a back-end application that helps teachers perform administrative functions for their students, built using the [NestJS](https://nestjs.com/) framework.

## Features
- Teacher can register one or more students to a specified teacher
- Teacher can retrieve a list of students common to a given list of teachers
- Teacher can suspend a specified student
- Teacher can retrieve a list of students who can receive a given notification


## Project setup

```bash
$ yarn install
```

## Environment setup

To run this project, you will need to create a `.env` file in the root directory by copying the `.env.template` file.

```bash	
$ cp .env.template .env
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Run linting

```bash
$ yarn run lint
$ yarn run format
```
