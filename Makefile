.PHONY: build prepare run test seed down setup-apps

COMPOSE = docker-compose

default: run

build:
	$(COMPOSE) build peatio barong

prepare:
	$(COMPOSE) up -d vault db redis rabbitmq smtp_relay coinhub peatio_daemons slanger
	$(COMPOSE) run --rm vault secrets enable totp || true

setup-apps: build
	$(COMPOSE) run --rm peatio bash -c "./bin/link_config && ./bin/setup"
	$(COMPOSE) run --rm barong bash -c "./bin/link_config && ./bin/setup"

run: prepare setup-apps
	$(COMPOSE) up peatio barong trading_ui proxy

test: prepare
	@$(COMPOSE) run --rm peatio_specs

start: prepare setup-apps
	$(COMPOSE) up -d peatio barong trading_ui proxy

update:
	git submodule update --init --remote

down:
	@$(COMPOSE) down
