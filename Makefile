.PHONY: build prepare run test stress seed down setup-apps

COMPOSE = docker-compose

default: run

build:
	$(COMPOSE) build peatio barong toolbox

geth:
	$(COMPOSE) up -d geth

daemons:
	$(COMPOSE) up --build -d deposit_coin_address withdraw_coin withdraw_audit blockchain

dependencies:
	$(COMPOSE) up -d vault db phpmyadmin redis rabbitmq smtp_relay slanger
	$(COMPOSE) run --rm vault secrets enable totp || true

prepare: dependencies daemons geth

setup-apps: build
	$(COMPOSE) run --rm peatio bash -c "./bin/link_config && rake db:create db:migrate db:seed"
	$(COMPOSE) run --rm barong bash -c "./bin/link_config && ./bin/setup"

run: prepare setup-apps
	$(COMPOSE) up --build -d peatio barong trading_ui proxy

test: prepare
	@$(COMPOSE) run --rm peatio_specs

stress:
	@bundle exec rake toolbox:run

start: prepare setup-apps
	$(COMPOSE) up -d peatio barong trading_ui proxy

update:
	git submodule update --init --remote

down:
	@$(COMPOSE) down
