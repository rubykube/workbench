# peatio-workbench

Peatio workbench is an easy way to start Peatio development environment.

## Prerequisites

- Docker [installed](https://docs.docker.com/engine/installation/)
- Docker Compose [installed](https://docs.docker.com/compose/install/)

## Usage

Clone the workbench and then clone rubykube/peatio `../peatio` if you haven't already

### Build

First you will need to build peatio containers
```
make build
```

### If you want to use bitgod as bitcoind JSON-RPC

1. In you currencies.yml

```yml
- id: 2
  key: satoshi
  code: btc
  symbol: "฿"
  coin: true
  precision: 8
  quick_withdraw_max: 1
  rpc: http://bitgo:changeme@bitgod:19332  #values from bitgod/config/bitgod.conf
  blockchain: https://blockchain.info/tx/#{txid}
  address_url: https://blockchain.info/address/#{address}
  assets:
    accounts:
      - address: your_bitgo_wallet_id
```

2. Start bitgo container and use your bitgo wallet

```bash
BITGO_ACCESS_TOKEN=your_bitgo_access_token BITGO_WALLET_ID=your_bitgo_wallet_id make bitgod
```

### Start services

```
make prepare
```

### Run Peatio or specs

To start Peatio run `make run`
(To test Peatio with an SMTP relay, set `RAILS_ENV` to production and fill out `smtp-relay.yaml` with correct values)

To run the tests, use `make test`

To tear down the environment, run `docker-compose down`
