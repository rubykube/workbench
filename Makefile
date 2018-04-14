.PHONY: build prepare run test seed down setup-apps

COMPOSE = sudo docker-compose -f compose/app.yaml -f compose/backend.yaml

default: run

build:
	$(COMPOSE) build peatio barong peatio-trading-ui nginx-server

prepare:
	$(COMPOSE) up -d vault db redis rabbitmq smtp_relay coinhub peatio_daemons
	$(COMPOSE) run --rm vault secrets enable totp

setup-apps: build
	$(COMPOSE) run --rm peatio "./bin/setup"
	$(COMPOSE) run --rm barong "./bin/setup"

run: prepare setup-apps
	$(COMPOSE) up peatio barong

test: prepare
	@$(COMPOSE) run --rm peatio_specs

seed:
	@$(COMPOSE) run --rm peatio "rake db:seed"

down:
	@$(COMPOSE) down
