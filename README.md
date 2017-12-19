# peatio-workbench

Peatio workbench is a easy to start development environment.

## Usage

Clone the workbench and then clone rubykube/peatio in it.

```
docker-compose build peatio
docker-compose up -d db redis rabbitmq
docker-compose run peatio rake db:migrate
docker-compose run peatio rails server
```
