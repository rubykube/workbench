# Workbench

Workbench is an easy way to start Peatio development environment.

## Prerequisites

- Docker [installed](https://docs.docker.com/engine/installation/)
- Docker Compose [installed](https://docs.docker.com/compose/install/)
- Vagrant [installed](https://www.vagrantup.com/downloads.html)
- VirtualBox [installed](https://www.virtualbox.org/)

## Usage

### Prepare the workbench

1. Recursive clone : `git clone --recursive https://github.com/rubykube/workbench.git`

2. Move to workbench `cd workbench`

2. Build the images: `make build`

3. Run the application: `make run`


To have barong login working with peatio you will need to add this to your `/etc/hosts`:

```
0.0.0.0 api.wb.local
0.0.0.0 auth.wb.local

0.0.0.0 api.slanger.wb.local
0.0.0.0 ws.slanger.wb.local

0.0.0.0 pma.wb.local
```

Now you have peatio up and running.

#### Barong

Start barong: `docker-compose run --rm barong bash -c "./bin/link_config && ./bin/setup"`

This will output password for **admin@barong.io**. Default password is `Qwerty123`

#### Peatio

Start peatio server: `docker-compose up -d peatio`

#### Frontend

Simply start your local server. Now you're able to log in with your local Barong and Peatio.

## Running Tests

Run toolbox stress tests

```sh
$> make stress
```

