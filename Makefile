.PHONY: build prepare run test seed down setup-apps

COMPOSE = docker-compose -f compose/app.yaml -f compose/backend.yaml

default: run

build:
	$(COMPOSE) build peatio barong

prepare:
	$(COMPOSE) up -d vault db redis rabbitmq smtp_relay coinhub peatio_daemons
	$(COMPOSE) run --rm vault secrets enable totp

setup-apps: build
	$(COMPOSE) run --rm peatio "./bin/setup"
	$(COMPOSE) run --rm barong "./bin/setup"

run: prepare setup-apps
	$(COMPOSE) up peatio barong

jest: 
	$(COMPOSE) -f compose/tests.yaml up --build jest


test: prepare
	@$(COMPOSE) run --rm peatio_specs

seed:
	@$(COMPOSE) run --rm peatio "rake db:seed"

down:
	@$(COMPOSE) down
