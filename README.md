<h1 align="center">
	Jobbee API
</h1>

<h3 align="center">
  An API that allows users to apply for a job.
</h3>

<p align="center">Find your dream job!</p>

<p align="center">
  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/alxrdev/jobbee-api?color=%23f58635">

  <a href="https://www.linkedin.com/in/alxrdev/" target="_blank" rel="noopener noreferrer">
    <img alt="Made by" src="https://img.shields.io/badge/made%20by-alex%20rodrigues%20moreira-%23f58635">
  </a>

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/alxrdev/jobbee-api?color=%23f58635">

  <a href="https://github.com/alxrdev/hcco/commits/master">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/alxrdev/jobbee-api?color=%23f58635">
  </a>

  <a href="https://github.com/alxrdev/hcco/issues">
    <img alt="Repository issues" src="https://img.shields.io/github/issues/alxrdev/jobbee-api?color=%23f58635">
  </a>

  <img alt="GitHub" src="https://img.shields.io/github/license/alxrdev/jobbee-api?color=%23f58635">
</p>
</br>

## 💇🏻‍♂️ About the project

This is a rest api made with Express, Typescript and MongoDB that allows users to apply for a job.

## 🚀 Technologies

Technologies that I used to develop this project

- [Express](https://expressjs.com/)
- [Typescript](https://www.typescriptlang.org/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [class-transformer](https://github.com/typestack/class-transformer)
- [class-validator](https://github.com/typestack/class-validator)
- [TSyringe](https://github.com/microsoft/tsyringe)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [multer](https://www.npmjs.com/package/multer)
- [nodemailer](https://www.npmjs.com/package/nodemailer)
- [Mailtrap](https://mailtrap.io/)

## 💻 Getting started

### Requirements

- Have NodeJS installed
- Have a MongoDB database

**Clone the project and access the folder**

```bash
$ git clone https://github.com/alxrdev/jobbee-api.git
$ cd jobbee-api
```

**Follow the steps below**
```bash
# Install the dependencies
$ yarn

# Start the client
$ yarn dev
```

**Create a '.env' file on the root folder and add your configs**
```

PORT=3000
HOST=http://localhost:3000
NODE_ENV=development
ORIGIN=http://localhost:3000

MONGODB_CONNECTION=

JWT_SECRET=
JWT_EXPIRES_TIME=15d

SMTP_PROFILE={ "provider": "", "senderName": "", "senderEmail": ", "host": "", "port": , "username": "", "password": "" }

STORAGE_TYPE=disk
STORAGE_PROFILES={"resume": { "tmpDestination": "", "destination": "", "extensionTypes": ".docx,.pdf", "mimeTypes": "application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf", "maxSize": 2000000 }, "avatar": { "tmpDestination": "", "destination": "", "extensionTypes": ".jpeg,.jpg,.png", "mimeTypes": "image/jpeg,image/png", "maxSize": 2000000 }}


```

Feito com 💜 por Alex Rodrigues Moreira 👋 [Veja meu Linkedin](https://www.linkedin.com/in/alxrdev/)
