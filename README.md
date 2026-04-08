<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Application Flow (End to End)

### 1) Startup flow

1. `src/main.ts` bootstraps Nest with `AppModule`.
2. `AppModule` imports:
   - `PrismaModule`
   - `UserModule`
   - `AuthModule`
3. `PrismaService` runs `onModuleInit()` and opens DB connection with `this.$connect()`.
4. API listens on `PORT` from env, or defaults to `3000`.

### 2) Module and service wiring

- `PrismaModule` is marked `@Global()`, so `PrismaService` is available app-wide.
- `UserService` injects `PrismaService` and handles DB operations for `User`.
- `UserModule` exports `UserService`.
- `AuthModule` imports `UserModule` and `JwtModule`.
- `AuthService` injects:
  - `UserService` (for user lookup/create)
  - `JwtService` (for access token generation)
- `AuthController` exposes auth endpoints and forwards requests to `AuthService`.

### 3) Prisma + MongoDB connection flow

1. Prisma reads `DATABASE_URL` from `.env` and `prisma.config.ts`.
2. `prisma/schema.prisma` defines:
   - datasource `db` with provider `mongodb`
   - `User` model (`id`, `email`, `password`, `name`, `birthYear`, timestamps)
3. `PrismaService` extends `PrismaClient`, so services can call:
   - `this.prisma.user.create(...)`
   - `this.prisma.user.findUnique(...)`
   - `this.prisma.user.findMany(...)`

### 4) Auth request flow

#### `POST /auth/signup`

1. `AuthController.signUp()` receives `email` and `password`.
2. `AuthService.signUp()` hashes password using `bcrypt`.
3. `AuthService` calls `UserService.createUser(...)`.
4. `UserService` writes user to MongoDB through Prisma.

#### `POST /auth/login`

1. `AuthController.signIn()` receives credentials.
2. `AuthService.signIn()` fetches user via `UserService.findUserByEmail(email)`.
3. Password is validated with `bcrypt.compare(...)`.
4. On success, JWT payload is created (`sub`, `email`).
5. `JwtService.signAsync(...)` returns `access_token`.

## Environment variables

Create/update `.env`:

```bash
DATABASE_URL="mongodb://127.0.0.1:27017/testing1212?replicaSet=rs0"
JWT_SECRET="your-very-strong-secret"
PORT=3000
```

## Commands to run the app

From project root:

```bash
# 1) install dependencies
npm install

# 2) generate Prisma client
npx prisma generate

# 3) (optional) validate Prisma schema
npx prisma validate

# 4) start app in watch mode
npm run start:dev
```

Other useful commands:

```bash
# normal run
npm run start

# build + production run
npm run build
npm run start:prod

# tests
npm run test
npm run test:e2e
npm run test:cov

# lint
npm run lint

# inspect database in browser
npx prisma studio
```

## Quick API test commands

```bash
# Signup
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"Pass@123\"}"

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"Pass@123\"}"
```

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
