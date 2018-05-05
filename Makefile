.PHONY: build prepare run test seed down setup-apps

COMPOSE = docker-compose -f compose/app.yaml -f compose/backend.yaml  -f compose/proxy.yaml

default: run

build:
	$(COMPOSE) build peatio barong peatio-trading-ui

prepare:
	$(COMPOSE) up -d vault db redis rabbitmq smtp_relay coinhub peatio_daemons
	$(COMPOSE) run --rm vault secrets enable totp || true

setup-apps: build
	$(COMPOSE) run --rm peatio "./bin/setup"
	$(COMPOSE) run --rm barong "./bin/setup"

run: prepare setup-apps
	$(COMPOSE) up peatio barong peatio-trading-ui proxy

test: prepare
	@$(COMPOSE) run --rm peatio_specs

start: prepare setup-apps
	$(COMPOSE) up -d peatio barong peatio-trading-ui

update:
	git submodule update --init --remote

down:
	@$(COMPOSE) down
