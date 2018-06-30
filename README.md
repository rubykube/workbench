# peatio-workbench

Peatio workbench is an easy way to start Peatio development environment.

## Prerequisites

- Docker [installed](https://docs.docker.com/engine/installation/)
- Docker Compose [installed](https://docs.docker.com/compose/install/)
- Vagrant [installed](https://www.vagrantup.com/downloads.html)
- VirtualBox [installed](https://www.virtualbox.org/)

## Usage

1. Recursive clone : `git clone --recursive https://github.com/rubykube/workbench.git`
2. `cd workbench`
2. Build the images: `make build`
3. run the application: `make run`
4. Add peatio and barong into your `/etc/hosts`

To have barong login working with peatio you will need to add this to your `/etc/hosts`:

```
0.0.0.0 auth.wb.local
0.0.0.0 api.wb.local

0.0.0.0 api.slanger.wb.local
0.0.0.0 ws.slanger.wb.local

0.0.0.0 pma.wb.local
```

Now all components are up and running.

Sign to barong `http://auth.wb.local` using `amdin@barong.io` email and `Qwerty123` password.

Visit `http://api.wb.local.

#### Frontend

Simply start your local server. Now you're able to log in with your local Barong and Peatio.

## Running Tests

```sh
$> make stress
```

## FAQ

Why there is no orders creaging in the trading UI, when `toolbox` is running ?

Please, start daemons with
```sh
$> make daemons
```
