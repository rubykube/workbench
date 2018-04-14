# peatio-workbench

Peatio workbench is an easy way to start Peatio development environment.

## Prerequisites

- Docker [installed](https://docs.docker.com/engine/installation/)
- Docker Compose [installed](https://docs.docker.com/compose/install/)


### Install Dependencies

```shell
sudo apt-get install \
  apt-transport-https \
  ca-certificates \
  curl \
  software-properties-common \
  build-essential \
  git
```


### Install Docker

```shell
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

sudo apt-key fingerprint 0EBFCD88

sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"

sudo apt-get update

sudo apt-get install docker-ce
```


### Install Docker Compose

```shell
sudo curl -L https://github.com/docker/compose/releases/download/1.20.1/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose
```

## Peatio Installation

### Prepare the workbench

1. Create a code folder and close the repo

```shell
mkdir code
cd code
git clone --recursive https://github.com/rubykube/workbench.git
```

2. Build the images: 

```
make build

NOTE : Make sure you grab the follwing info generate by "make build"

== Seeding database ==
email : admin@barong.io
Admin credentials: dbfb0775ec32d7d2db51daa1da51d9aa2deaeba9
Name: Local Peatio
Application ID: a68be319fca51caca60eed5711226e568bd1c1d13ff452b945515f1a6ffbaca4
Secret: ab80e2c843861c4d23e63f5472cd1c9ee6f55e388863e21f22b03a9093977f29
```

3. run the application: `make run`

4. Configure the HOST

- If you run peatio locally, to have barong login working with peatio you will need to add this to your `/etc/hosts`. 

```
0.0.0.0 peatio
0.0.0.0 barong
```

- If you run from a server, just make sure to update the URL_HOST in `/compose/app.yaml` 

```
URL_HOST: ec2-xx-xxx-xxx-xxx.compute-1.amazonaws.com:8000
```



### Run Barong and Peatio

#### Barong

1. In `docker-compose.yaml`, set the newly created application credentials:

```yaml
TWILIO_ACCOUNT_SID: <sid>
TWILIO_AUTH_TOKEN: <token>
TWILIO_PHONE_NUBER: +15555889459
```

2. Start barong: 

```shell
docker-compose up -d barong
```

3. Get the creds you got from the `make run`
4. Sign in at [barong:8001](http://barong:8001), then go to [/admin](http://barong:8001/admin)
   and navigate to [Applications](http://barong:8001/oauth/applications)
5. Create new application with the following callback url `http://peatio:8000/auth/barong/callback`
6. Make sure you then sign-in using admin@peatio.io and validate your phone number.

7. (temporary) Fix the authentication issue
  - Login to the Barong container `docker exec -i -t workbench_barong_1 /bin/bash`
  - Run the rails command line: `rails console`
  - Run `Account.update_all(state: "active")`
  - Then exit the rails console and exit the container.
  - Stop and restart it.

#### Peatio

1. In `compose/app.yaml`, set the newly created application credentials:

```yaml
- BARONG_CLIENT_ID=xxxxx
- BARONG_CLIENT_SECRET=xxxxx
```

2. And set your callback URL

```yaml
BARONG_OAUTH2_REDIRECT_URL: http://ec2-xx-xxx-xxx-xxx.compute-1.amazonaws.com:8000/auth/barong/callback
```

3. Start peatio server

```shell
docker-compose up -d peatio
```

#### Running on a server

- Make sure your port 8000 (peatio) and 8001 (barong) are open for testing.  (They can be closed after you install nginx)



### Run Peatio Trading UI

Clone the repo and setup the Trading UI

```shell
cd ~/code
git clone https://github.com/rubykube/peatio-trading-ui.git
cd peatio-trading-ui
bundle install
bin/init_config
```

Edit the `/config/application.yml` and set your app DNS.  Ex: 

```shell
PLATFORM_ROOT_URL: http://ec2-xx-xx-xxx-xxx.compute-1.amazonaws.com
```

Refer to the release note here : https://github.com/rubykube/peatio/blob/master/docs/releases/1.5.0.md





### Install nginx to setup a reverse proxy

```shell
sudo apt-get update
sudo apt-get install nginx
sudo ufw allow 'Nginx HTTP'
systemctl status nginx

```
At this point you should see nginx running

But you need to edit the default config to setup the reverse proxy.
Open `/etc/nginx/sites-available/default` in your favorite editor

Replace the content of the file by the following

```
server {
  server_name http://peatio.local;
  listen      80 default_server;

  location ~ ^/(?:trading|trading-ui-assets)\/ {
    proxy_pass http://127.0.0.1:4000;
  }

  location / {
    proxy_pass http://127.0.0.1:3000;
  }
}
```

Make sure to replace `http://peatio.local` with your actual server DNS

Verify that the syntax of the config file is valid : `$ sudo nginx -t`

Restart nginx by running `sudo systemctl restart nginx`



## Running Tests

>**TODO**
