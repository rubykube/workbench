.PHONY: build prepare run test seed down setup-apps

COMPOSE = docker-compose

default: run

build:
	$(COMPOSE) build peatio barong

prepare:
	$(COMPOSE) up -d vault db redis rabbitmq smtp_relay coinhub peatio_daemons
	$(COMPOSE) run --rm vault secrets enable totp || true

setup-apps: build
	$(COMPOSE) run --rm peatio "./bin/setup"
	$(COMPOSE) run --rm barong "./bin/setup"

run: prepare setup-apps
	$(COMPOSE) up peatio barong proxy

test: prepare
	@$(COMPOSE) run --rm peatio_specs

start: prepare setup-apps
	$(COMPOSE) up -d peatio barong proxy

update:
	git submodule update --init --remote

down:
	@$(COMPOSE) down
