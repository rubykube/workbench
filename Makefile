.PHONY: build prepare run test

default: run

build:
	@docker-compose build peatio
	@docker-compose build peatio_specs

prepare:
	@docker-compose up -d db redis rabbitmq selenium

run: prepare
	@docker-compose run peatio rake db:migrate
	@docker-compose run -p 8080:8080 peatio rails server

test: prepare
	@docker-compose run peatio_specs rake db:create db:migrate RAILS_ENV=test
	@docker-compose run peatio_specs

delete:
	@docker-compose down db redis rabbitmq selenium peatio
