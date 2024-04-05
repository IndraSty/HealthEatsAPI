# HealthEatsAPI
This project implement RestFul API architecture with Node.Js Express Library, Prisma ORM and MySQL for the DBMS. Beside that in authentication also used JWT(JSON Web Token) as the technology.

### Documentation
Checkout the documentation -> [API Documentation](https://documenter.getpostman.com/view/29695288/2s9YkobgDu)

### Cloud Computing
Member:
- Indra Budi Styawan
- I Putu Yuda Dharmawan

### Requirement
- follow the steps to install tensorflow js for this API, you can see [here](https://www.npmjs.com/package/@tensorflow/tfjs-node)
- install docker in your local machine, you can follow installation steps [here](https://docs.docker.com/desktop/)

### API Instalation
To run this Application in your local machine, follow these steps:
Clone the repository to your machine and install the needed dependencies. We use `npm` to manage our packages, so please make sure it is installed in your local machine.
```bash
git clone https://github.com/IndraSty/nustaravel.git

cd nustaravel

npm install
```
Start up a docker container running MySQL. A `docker-compose` file is provided to make this easier.
```bash
docker compose up
```
Complete the environment in `.env.example`

Run migrations using prisma
```bash
npx prisma migrate dev
```

Import data from the `/data` folder to your database. We recommend using a GUI like MySQL Workbench, or DBeaver to make this easier.

Run the Application in your local machine
```bash
npm run dev
```
