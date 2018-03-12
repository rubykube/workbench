.PHONY: build prepare run test seed down setup-apps

default: run

build:
	docker-compose build peatio barong

prepare:
	docker-compose up -d vault db redis rabbitmq smtp_relay coinhub peatio_daemons
	docker-compose run --rm vault secrets enable totp

setup-apps: build
	docker-compose run --rm peatio "./bin/setup"
	docker-compose run --rm barong "./bin/setup"

run: prepare setup-apps
	docker-compose up peatio barong

test: prepare
	@docker-compose run --rm peatio_specs

seed:
	@docker-compose run --rm peatio "rake db:seed"

down:
	@docker-compose down
