.PHONY: build prepare run test seed down setup-apps

default: run

build:
	docker-compose build peatio barong peatio_trading_ui

prepare:
	docker-compose up -d db redis rabbitmq smtp_relay coinhub peatio_daemons

setup-apps: build
	docker-compose run --rm peatio "./bin/setup"
	docker-compose run --rm barong "./bin/setup"
	docker-compose run --rm peatio_trading_ui "./bin/setup"

run: prepare setup-apps
	docker-compose up peatio barong peatio_trading_ui

up:
	docker-compose up peatio barong peatio_trading_ui

test: prepare
	@docker-compose run --rm peatio_specs

seed:
	@docker-compose run --rm peatio "rake db:seed"

down:
	@docker-compose down
