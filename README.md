# DIGSPEC API

## Documentation

[Swedish Documentation 🇸🇪](DOCUMENTATION-SE.md)
[English Documentation 🌍](DOCUMENTATION.md)

## Running the API
To be able to run the API you will need to either set the env variable **DB_URI** to a valid [mongodb connection uri](https://docs.mongodb.com/manual/reference/connection-string/) or have a [local mongodb running on your system](https://docs.mongodb.com/guides/server/install/).

### Dev
If you want to run the api during development you can do this with the `npm run dev` command.

You should now be able to navigate to the api via port *8080* as long as you have not set the env variable **PORT**

### Build & Run Method
Start by building the code you do this with  `npm run build` After you've run the build command you can run `npm run start` and that should start your application.

You should now be able to navigate to the api via port *8080* as long as you have not set the env variable **PORT**

### Docker
If you want  to use [docker](https://docs.docker.com/get-started/) you use the following steps.
1. Navigate to the root of this project folder.
2. Run `docker build -t digspec-api .`
3. Run `docker run -p <your port of choice>:8080 -e "DB_URI=<mongodb connection uri>" digspec-api`

You should now be able to navigate to the api via port *8080*.

When you want to turn off your api and docker container, do the following steps:
1. Run `docker container ls` to find the CONTAINER ID of your container.
2. Run `docker kill <CONTAINER ID>` to stop the container with the specified CONTAINER ID.

## Tests
Tests are written with jest and supertest. You can locate these tests inside ´src/__tests__/´
