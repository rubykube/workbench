.PHONY: build prepare run test seed down setup-apps

default: run

build:
	docker-compose build peatio barong

prepare:
	docker-compose up -d db redis rabbitmq smtp-relay coinhub peatio_daemons

setup-apps:
	docker-compose run --rm peatio "./bin/setup"
	docker-compose run --rm barong "./bin/setup"

run: prepare
	docker-compose up peatio barong

test: prepare
	@docker-compose run --rm peatio_specs

seed:
	@docker-compose run --rm peatio "rake db:seed"

down:
	@docker-compose down
