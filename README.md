# peatio-workbench

Peatio workbench is an easy way to start Peatio development environment.

## Prerequisites

- Docker [installed](https://docs.docker.com/engine/installation/)
- Docker Compose [installed](https://docs.docker.com/compose/install/)


### Install Dependencies

```shell
sudo apt-get install -y \
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

sudo apt-get install -y docker-ce
```


### Install Docker Compose

```shell
sudo curl -L https://github.com/docker/compose/releases/download/1.20.1/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose
```

## Peatio Installation

### Prepare the workbench

1. Create a code folder and clone the repo

```shell
mkdir code
cd code
git clone --recursive https://github.com/rubykube/workbench.git
```


2. Adjust the configuration

- Edit `compose/app.yaml`

```
- services -> peatio -> environment -> URL_HOST: ec2-xx-xxx-xxx-xxx.compute-1.amazonaws.com  # No need for a port as nginx do the tricks of port forwarding (NOT SURE!!!)
- services -> peatio -> environment -> BARONG_OAUTH2_REDIRECT_URL: http://ec2-xx-xxx-xxx-xxx.compute-1.amazonaws.com:8000/auth/barong/callback
- services -> peatio -> environment -> BARONG_DOMAIN: http://ec2-xx-xx-xx-xxx.compute-1.amazonaws.com:8001
- services -> barong -> environment -> TWILIO_ACCOUNT_SID: <sid>
- services -> barong -> environment -> TWILIO_AUTH_TOKEN: <token>
- services -> barong -> environment -> TWILIO_PHONE_NUBER: <1604xxxyyyy>
```


- Edit `app/peatio_trading_ui/config/template/secret.yml.erb`

```shell
PLATFORM_ROOT_URL: http://ec2-xx-xx-xxx-xxx.compute-1.amazonaws.com
```


- Edit `app/nginx/default.conf` and add your server_name

```
server {
  server_name http://ec2-xx-xxx-xxx-xxx.compute-1.amazonaws.com;
...
```


- Edit the Barong config

```shell
1. Open app/barong/bin/setup

# Change the follwing line:
system! 'bin/rails log:clear tmp:clear'

# By this one: 
system! 'bin/rails log:clear tmp:clear db:drop'
 

2. Open app/barong/config/secrets.yml

# Change the follwing line:
twilio_phone_number: '+15005550006'

# By this one:
twilio_phone_number: <%= ENV['TWILIO_PHONE_NUMBER'] %>
```


- Edit the Peatio config file

```
1. Open app/peatio/bin/setup

# Comment the folling line

puts "\n=== Copying config files ==="
system 'bin/init_config'
 

puts "\n=== Install yarn packages ==="
system 'bin/rake yarn:install'
system 'bin/rake tmp:create yarn:install assets:precompile'
```




3. (optional) Configure the HOST

- If you run peatio locally, to have barong login working with peatio you will need to add this to your `/etc/hosts`. 
- Make sure all your "server name / host name" represent the choosen host name

```
0.0.0.0 peatio
0.0.0.0 barong
```


4. Build the images and lunch the containers: 

```
$ make

NOTE : Make sure you grab the follwing info generate during the setup of the barong container

== Seeding database ==
email : admin@barong.io
Admin credentials: dbfb0775ec32d7d2db51daa1da51d9aa2deaeba9
Name: Local Peatio
Application ID: a68be319fca51caca60eed5711226e568bd1c1d13ff452b945515f1a6ffbaca4
Secret: ab80e2c843861c4d23e63f5472cd1c9ee6f55e388863e21f22b03a9093977f29
```




### Run Barong and Peatio

#### Barong

1. Get the creds you got from executing `make`
2. Sign in at [barong:8001](http://barong:8001), you'll get a redirect error, don't freak out ;-)
3. Go to [/admin](http://barong:8001/admin) and navigate to [Applications](http://barong:8001/oauth/applications)
4. Edit Local Peatio application and change the server name in the callback url: `http://ec2-xx-xx-xx-xxx.compute-1.amazonaws.com/auth/barong/callback`
5. Click on the "Authorize" button to register the callback URL
6. Activate the admin account
  - Login to the Barong container `sudo docker exec -it compose_barong_1 bash`
  - Run the rails command line: `rails console`
  - Run `Account.update_all(state: "active")`
  - Exit the rails console and exit the container.


#### Peatio

1. (Optional) If you created a new app in Barong, in `compose/app.yaml`, set the newly created application credentials:

```
- BARONG_CLIENT_ID=xxxxx
- BARONG_CLIENT_SECRET=xxxxx


# Recreate the Peatio container

docker-compose down peatio
docker-compose up -d peatio
```


#### Running on a server

- Make sure your port 8000 (peatio) and 8001 (barong) are open for testing.  (They can be closed after you install nginx)


### Run Peatio Trading UI

Automatically started in a docker container.

Refer to the release note here : https://github.com/rubykube/peatio/blob/master/docs/releases/1.5.0.md




### Install nginx to setup a reverse proxy


Automatically started in a docker container.


## Running Tests

>**TODO**
