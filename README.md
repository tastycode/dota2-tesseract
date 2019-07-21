![Example To Do App](./static/site-image.png)
# Next-SMRT
> Next.js, Styled Components, Material-UI, Redux (With Typesafe-Actions), Typescript

A lot of the next.js examples have some of those features but not all together. So I decided to roll them all into one boilerplate.

I use it to kickstart everything I do now. Works great in production!

## Example TODO List App
![Example To Do App](https://csprance.com/shots/2018-08-12_80391bbd-a273-454b-9d85-f45c0bca6d37.png)

## Features
### Uses
 - [next@9](https://github.com/zeit/next.js)
 - [react@16](https://github.com/facebook/react)
 - [typescript](https://github.com/Microsoft/TypeScript)
 - [redux@4](https://github.com/reduxjs/redux)
 - [redux-thunk](https://github.com/reduxjs/redux-thunk)
 - [redux-persist](https://github.com/rt2zz/redux-persist)
 - [typesafe-actions](https://github.com/piotrwitek/typesafe-actions)
 - [Jest](https://github.com/facebook/jest)
 

### Using cdn
 - material-icons font
 - roboto-font

## Installation

```sh
git clone https://github.com/csprance/next-smrt.git
```

## Setup

set SEO variables

> src/constants/env.ts

```typescript
// for meta tag <og & twitter>
export const SITE_NAME = ''
export const SITE_TITLE = ''
export const SITE_DESCRIPTION = ''
export const SITE_IMAGE = ''
```

---

## Environment Install Instructions

### Development

#### Installation

```
npm install
npm run dev # run
```

#### Test

```
npm run test # test
npm run test:watch
npm run test:coverage # report coverage
```

### Production

```
npm install
npm run build # create .next directory
npm start # start server
```

or for static export

```
npm install
npm run build # create .next directory
npm run export # create .out directory
```

# Docker
> Assumes traefik is running
* run `docker-compose up -d --build`
* Visit `http://next-smrt.localhost` 


Check out the other docker-compose files for more uses and the `Dockerfile` for the image 
that will be built to run the app
 
## License

UNLICENSE
