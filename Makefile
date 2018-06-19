.PHONY: build prepare run test seed down setup-apps

COMPOSE = docker-compose

default: run

build:
	$(COMPOSE) build peatio barong

daemons:
	$(COMPOSE) up -d deposit_coin deposit_coin_address slave_book market_ticker matching \
		order_processor pusher_market pusher_member trade_executor withdraw_coin

dependencies:
	$(COMPOSE) up -d vault db redis rabbitmq smtp_relay coinhub slanger
	$(COMPOSE) run --rm vault secrets enable totp || true

prepare: dependencies daemons

setup-apps: build
	$(COMPOSE) run --rm peatio bash -c "./bin/setup"
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
