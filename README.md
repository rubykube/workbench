# peatio-workbench

Peatio workbench is an easy way to start Peatio development environment.

## Prerequisites

- Docker [installed](https://docs.docker.com/engine/installation/)
- Docker Compose [installed](https://docs.docker.com/compose/install/)

## Usage

Clone the workbench and then clone rubykube/peatio `../peatio` if you haven't already

### Build

First you will need to build peatio containers
```
make build
```

### Start services

```
make prepare
```

### Run Peatio or specs

To start Peatio run `make run`
(To test Peatio with an SMTP relay, set `RAILS_ENV` to production and fill out `smtp-relay.yaml` with correct values)

To run the tests, use `make test`

To tear down the environment, run `docker-compose down`
