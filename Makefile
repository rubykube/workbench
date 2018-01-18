.PHONY: build prepare run test seed down

default: run

build:
	docker-compose build peatio

prepare:
	docker-compose up -d db redis rabbitmq smtp-relay selenium peatio_daemons
	docker-compose run --rm peatio "rake db:create db:migrate"
	docker-compose run --rm -e RAILS_ENV=test peatio_specs "rake db:create db:migrate"

run: prepare
	docker-compose up peatio # ngx-cryptobase

test: prepare
	@docker-compose run --rm peatio_specs

seed:
	@docker-compose run --rm peatio "rake db:seed"

down:
	@docker-compose down

enterprise:
	docker-compose build ngx-cryptobase
	docker-compose up ngx-cryptobase
