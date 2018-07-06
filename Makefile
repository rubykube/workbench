.PHONY: build prepare run test stress seed down setup-apps

JWT_PUB_PATH   := config/default.rsa.pub
JWT_PUBLIC_KEY ?= "$(shell base64 --wrap=0 $(JWT_PUB_PATH))"
COMPOSE        := JWT_PUBLIC_KEY=$(JWT_PUBLIC_KEY) docker-compose

default: run

build:
	$(COMPOSE) build peatio barong toolbox

geth:
	$(COMPOSE) up -d geth

daemons:
	$(COMPOSE) up -d deposit_coin deposit_coin_address slave_book market_ticker matching \
		order_processor pusher_market pusher_member trade_executor withdraw_coin

dependencies:
	$(COMPOSE) up -d vault db phpmyadmin redis rabbitmq smtp_relay slanger
	$(COMPOSE) run --rm vault secrets enable totp || true

prepare: dependencies daemons geth

setup-apps: build
	$(COMPOSE) run --rm peatio bash -c "./bin/setup"
	$(COMPOSE) run --rm barong bash -c "./bin/link_config && ./bin/setup"

run: prepare setup-apps
	$(COMPOSE) up peatio barong trading_ui proxy

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
