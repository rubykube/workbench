# Fork notes
- Disable builtin `geth` and `bitcoind` services.
  Point to pre-established nodes on `10.8.0.1` instead.
- Replace all seed addresses with ones controlled by us.
- Change git submodules to point to forked repos.
- Expose mysql port 3306 for easier debugging.

# Fork usage
These are just slightly modified from the original usage in [README.md](README.md#Usage). 

## Prerequisites

- Docker [installed](https://docs.docker.com/engine/installation/).
  If you use Docker for Mac, please adjust it to at least 4 CPUs and 8 GB of RAM, for better experience.
- Docker Compose [installed](https://docs.docker.com/compose/install/).
  Already included in Docker for Mac.
- Ruby 2.5.1 ([rvm](https://rvm.io/) recommended)
  ```
  $ gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB

  $ \curl -sSL https://get.rvm.io | bash -s stable --rails --ruby=2.5.1
  ```
  You may need to open a new terminal for `rvm` to start to take effect. 

## Usage

### Prepare the workbench

1. Recursive clone

   ```sh
   git clone --recursive git@github.com:megaspacelab/workbench.git
   ```

1. Move to workbench

   ```sh
   cd workbench
   ```

1. Install `bundler` and dependencies

   ```sh
   gem install bundler
   bundle install
   ```

1. Build the images

   ```sh
   make build
   ```

1. **Optional (but recommended):** Enable bitcoin

   ```sh
   make bitcoin
   ```

   This will seed your deployment with bitcoin blockchain and currency.

1. Run the application.
   **Make sure you are connected to corp VPN first.**
   This is needed to access the blockchain nodes.

   ```sh
   make run
   ```

1. You should add those hosts to your `/etc/hosts` file:

   ```
   0.0.0.0 api.wb.local
   0.0.0.0 auth.wb.local
   
   0.0.0.0 ws.ranger.wb.local
   
   0.0.0.0 pma.wb.local
   0.0.0.0 monitor.wb.local
   
   0.0.0.0 btc.wb.local
   0.0.0.0 eth.wb.local
   
   0.0.0.0 mail.wb.local
   ```

Now you have peatio up and running.
To stop it, run
```
make down
```

This preserves all your application states (docker volumes).
To wipe everything for a clean relaunch, run
```
docker-compose down -v
```

### Access web UI
- [Admin Panel](http://api.wb.local/admin)
- [Profile](http://api.wb.local/settings)

You will be redirected to [Barong](http://auth.wb.local/) for authentication. Here's the admin credential:
- Email: `admin@barong.io`
- Password: `Chah5YohWm`

### Post installation steps

After deployment, height of blockchains should be updated to start receiving deposits.

Go to **Blockchains** Tab in Peatio Admin Panel and update height to the current head.

Best way to find current blockchains height:

1. [Ethereum Rinkeby Blockchain Explorer](https://rinkeby.etherscan.io)
2. [Bitcoin Testnet Blockchain Explorer](https://testnet.blockchain.info)
