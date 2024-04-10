
## Description
NestJS API Development Assignment


## Technical Stack

- NestJS
- PostgreSQL + TypeORM
- JWT, Passport
- NestJS ConfigurationService
- NestJS ValidationPipe using `class-validator` and `class-transformer`
- Docker for DB server
- Repository Pattern for persistence
- Role based endpoint protection


## Installation

```bash
$ npm install
```

## Getting Started

### Install packages
```bash
$ npm install
```

### Environment Setup

- Copy `.env.example` as `.env` file

- Update the `DATABASE_HOST` in `.env` file to `localhost`.

  This is necessary to run dev server locally.

### Run the servers

```bash
$npm run docker:dev:up
```

This command runs PostgreSQL database server and adminer(a tiny database administration app) containers.

The `docker-compose.yaml` file has the setup for api container also, so we just run only these two services.


### Run migration and seed initial users

```bash
$npm run migration:run
$npm run seed:run
```

These command will migrate the current database, and seed the initial users (currently one admin user and one normal user).

### Start the dev server

```bash
$npm run start:dev
```


## TBD

- Complete the unit tests
- Add more content to `README.md`