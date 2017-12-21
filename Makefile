.PHONY: build prepare run test

default: run

build:
	@docker-compose build peatio
	@docker-compose build peatio_specs

prepare:
	@docker-compose up -d db redis rabbitmq selenium

run: prepare
	@docker-compose run --rm peatio rake db:create db:migrate db:seed
	@docker-compose run --rm peatio

test: prepare
	@docker-compose run --rm peatio_specs rake db:create db:migrate RAILS_ENV=test
	@docker-compose run --rm peatio_specs

delete:
	@docker-compose down
