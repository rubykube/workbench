.PHONY: prepare run test

default: run

prepare:
	@docker-compose build peatio
	@docker-compose up -d db redis rabbitmq

run: prepare
	@docker-compose run peatio rake db:migrate
	@docker-compose run -p 8080:8080 peatio rails server

test: prepare
	@docker-compose up -d selenium
	@docker-compose run peatio rake db:create db:migrate RAILS_ENV=test
	@docker-compose run peatio rspec
