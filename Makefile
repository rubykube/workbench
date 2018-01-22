.PHONY: build prepare run test seed down

default: run

build:
	docker-compose build peatio
	docker-compose build ngx-cryptobase
	docker-compose build bitgod

prepare:
	docker-compose up -d db redis rabbitmq smtp-relay selenium peatio_daemons bitgod
	docker-compose run --rm peatio "rake db:create db:migrate"
	docker-compose run --rm -e RAILS_ENV=test peatio_specs "rake db:create db:migrate"
	docker-compose exec bitgod sh -c "bitcoin-cli -rpcconnect=bitgod settoken $BITGO_ACCESS_TOKEN && bitcoin-cli -rpcconnect=bitgod setwallet $BITGO_WALLET_ID"

run: prepare
	docker-compose up peatio ngx-cryptobase

test: prepare
	@docker-compose run --rm peatio_specs

seed:
	@docker-compose run --rm peatio "rake db:seed"

down:
	@docker-compose down
