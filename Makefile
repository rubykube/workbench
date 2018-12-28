.PHONY: build prepare run test stress seed down setup-apps config

COMPOSE = docker-compose

default: run

pull:
	@$(COMPOSE) pull vault      \
	                db          \
	                redis       \
	                rabbitmq    \
	                mailcatcher \
	                ranger      \
	                coinhub

config:
	@echo -e "\e[34mRendering configuration...\e[0m"
	@bundle exec rake config:render

build: config pull
	@$(COMPOSE) build peatio barong

geth:
	@$(COMPOSE) up -d geth

bitcoin:
	@echo -e "\e[34mUpdating peatio configuration...\e[0m"
	@cp config/peatio-seed-btc/*.yml config/peatio/seed/
	@echo -e "\e[34mStarting bitcoind container...\e[0m"
	@$(COMPOSE) up -d bitcoind

daemons:
	@$(COMPOSE) up --build -d withdraw_audit          \
	                         blockchain               \
	                         global_state             \
	                         deposit_collection       \
	                         deposit_collection_fees  \
	                         deposit_coin_address     \
	                         slave_book market_ticker \
	                         pusher_market            \
	                         pusher_member            \
	                         matching                 \
	                         order_processor          \
	                         trade_executor           \
	                         withdraw_coin	          \
	                         k

dependencies:
	@$(COMPOSE) up -d vault db redis rabbitmq mailcatcher ranger coinhub
	@$(COMPOSE) run --rm vault secrets enable totp || true

proxy:
	@touch config/acme.json && chmod 0600 config/acme.json

prepare: proxy dependencies daemons

setup-apps: build
	@$(COMPOSE) run --rm peatio bash -c "./bin/link_config && bundle exec rake db:create db:migrate db:seed"
	@$(COMPOSE) run --rm barong bash -c "./bin/link_config && ./bin/setup"

run: config prepare setup-apps
	@$(COMPOSE) up --build -d peatio barong proxy mikroapp tower gateway

stress:
	@bundle exec rake toolbox:run

start: config prepare setup-apps
	@$(COMPOSE) up -d peatio barong proxy mikroapp tower gateway

update:
	@git submodule update --init --remote

down:
	@echo -e "\e[1;31mRemoving docker containers...\e[0m"
	@$(COMPOSE) rm -fsv
