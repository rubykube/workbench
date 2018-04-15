.PHONY: build prepare run test seed down setup-apps

COMPOSE = sudo docker-compose -f compose/app.yaml -f compose/backend.yaml

default: run

prepare:
				$(COMPOSE) up -d vault db redis rabbitmq smtp_relay coinhub peatio_daemons
				$(COMPOSE) run --rm vault secrets enable totp

build:
				$(COMPOSE) build peatio barong peatio_trading_ui nginx_server

setup-apps:
				$(COMPOSE) run --rm peatio "./bin/setup"
				$(COMPOSE) run --rm barong "./bin/setup"

up:
				$(COMPOSE) up -d barong peatio peatio_trading_ui

run: prepare build setup-apps up

serve:
				$(COMPOSE) up -d nginx_server

test: prepare
				@$(COMPOSE) run --rm peatio_specs

seed:
				@$(COMPOSE) run --rm peatio "rake db:seed"

down:
				@$(COMPOSE) down



