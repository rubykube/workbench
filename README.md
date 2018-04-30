# peatio-workbench

Peatio workbench is an easy way to start Peatio development environment.

## Prerequisites

- Docker [installed](https://docs.docker.com/engine/installation/)
- Docker Compose [installed](https://docs.docker.com/compose/install/)

## Usage

### Run the workbench using Vagrant

```
vagrant up
```

### Prepare the workbench

1. Recursive clone : git clone --recursive https://github.com/rubykube/workbench.git
2. Build the images: `make build`
3. run the application: `make run`
4. Add peatio and barong into your /etc/hosts

To have barong login working with peatio you will need to add this to your `/etc/hosts`:

```
0.0.0.0 peatio
0.0.0.0 barong
```

### Run Barong and Peatio

#### Barong

1. Start barong: `docker-compose up -d barong`
2. Create admin user for barong: `docker-compose run --rm barong bin/rake db:seed`
   It will output password for **admin@barong.io**
3. Sign in at [barong:8001](http://barong:8001), then go to [/admin](http://barong:8001/admin)
   and navigate to [Applications](http://barong:8001/oauth/applications)
4. Create new application with the following callback url `http://peatio:8000/auth/barong/callback`

#### Peatio

1. In `docker-compose.yaml`, set the newly created application credentials:

```yaml
- BARONG_CLIENT_ID=xxxxx
- BARONG_CLIENT_SECRET=xxxxx
```

2. Start peatio server: `docker-compose up -d peatio`

#### Frontend

Simply start your local server. Now you're able to log in with your local Barong and Peatio.

## Running Tests

## Q&A
1. Create new keypair for JWT
* Automatically:
  Run `rake jwt` in the workbench root
* Manually:
    1. Generate a new RSA keypair.
    2. Add base64-encoded PEM keys in workbench root file `.env`. Example:
  ```
JWT_SHARED_SECRET_KEY=LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFb3dJQkFBS0NBUUVBdFRFendCRG1xcEdYSE5RL2VtMUpzQ21PUWVQVlY4VWdWVXNMcDJZSWxNTTRaT00yClRha2dJbVpKNkdnT2FxNlY0cTZoZS94a2lpNHNYbGpiKzVlL2Z1RmtjYktNVnJ0UURHKysyVTBwVkdEak5JZzgKS1J3eU00SlQrQ3NzV3NSbFFDNkRUbVh3b1pJb1pXYThhdFlFVWFMOC9IVDVBUE5ORnJjU21iVUhKYTdQUWxscQpLMytZZkRDeS8yMlJzZXBIdWcyYzdPbUdqQXBIZmYrTjg3RFVwczBaUkdsb1B2eVArVmlyRVlhMTc3eloxczQrCk0xcGpwakw2b2ZBZFNhczVKd3h2VDY1RTRZZGVmTzMvWEx1VlNuTjdyOHduczFqQWxTeHJuc3pMR0Y1bXRjS3YKTEFwbVlHcHhScmFpa2JETUFpZmFLdVhOTm9UTitZeXBXR0tkZ1FJREFRQUJBb0lCQUFIbVBTT2pTYmU2QlBxQgpZeFQyZGxKSmJUdFZseFB2ZGhKTzBoVjBKVnpoMndKN3UwTC9KZDRXY21ua1JWcHE4QmxMT1ZnaVlpOXNvbnh1CnRBZWtKSmJBNkJ1bEFvR2FQeEdTVGs3YTF6Y1NPTytCQ2hob09rSjkrRUZldW4xTkY3NmZmakxoTUsrUTU2bUEKZFRNdGdTZ1Y3RTc5THVzS29lRStGQXpXYi9lK0k5c0JPamsrb1l2dDg3TnZwTDkyZE9iKytVYlNCS0MxNGhLbgpVZEYyVGpSS0g2alU1WSthcUNnVDZ6U3JVYkZUT1orRUFaMFd3aWo5cTJKOG9Yb1RmcEMyNnpuNHJZYlE3YjRlCjNDSnNOR1I4amZpbDhVakU1VFc2N3J4Nk82MUZUZDNGaEZNTjNnVjBzTE9FdHBTR0VtSmNLekdkem9WdytQRG8KbmhzVnlXMENnWUVBNFFhY2JBV21RUGw2K0F1SnJJSWpHK3JXMUk2NDlmLzQrVXFEMDFpZTd0VjlLeTNSL2l3bQpYa1RtUk1VMEtDZkNPVnJmS1RRbUZpSldvQk5pZFMvUCtRRUF0SGhzZlRmSXBqSFpycGpwS0NsV3prU0xkd0dpCm83YzhzbjduNjBxS3JjbGtJTU1RZE44UWtDZVJVNy9qQ1dhNXU1eU5QN1R3SFhPc0FEZ295TU1DZ1lFQXppSCsKM1M0WjRxckV4ZnkwZ0lraVZLRnRGZlBoQnNZQ0c3SUlhTFVidGVZT3ZPckpNM3QzUXZIblRSek5ZMjd6TVlrZApQWlFlbU9GMG54QTVkR243emF3RGpjcis1SXRrVlliWldCekJXcHpZci9PclNmUllsdHVseElZQjRkb2hqVXYrCllYc3AvREQ0TU1tb2NFUzBkSkRLVTR6YTdHK0NxUjFVNnRJRFBHc0NnWUVBajFXWHM1TVJxRmVCaFpoTDFLOTgKVDU4UndvazZ0YStiMXFjcE95azY2MlRmZXU2UDBUZ3NKR1g4eXhkV05ySEVuS1lPZWY5MnR5aWVSdzZ4NjNWTwpJdzBKZHVzeUo3eXR1WGNOY3BLQ0NZdnplQ1hmTkNtOWdFMEtnNlFrZEJLaUxUcVg1ZXA2aEFkR1ZKeHZqSW93Cnd0OUZOWVR0MEFPZjR4SzRIOWVsMnVNQ2dZQktMQlZuUlJWdmFIOVJ0ckxFcFpQQzNDdENnUFR4MlFJZE1SeXgKZ0ttdDlGQk5UamFEM2VOMkpWRlRnQSt2dmRhb2Rtd2RJbFU0TWJnakhGVndQRXF0SVQ1T0lVTkN2WjJtNE5VSQpUYUNObUc2b01ZZnJIbzlhQ1VOR3llbVhlVVFsY2JqaEhzNW12c0F2M2dCTUZZelJmT0F3M0RoU1ozV2VvTDFUCm1hb3NiUUtCZ0ZMMnlOb2dubHhJMXowTFQ3eTk0ZzlORjRyY1FsZGZJZHFQOVlkUzdLeUUxSk40SFVoMHl3dk0KeCtLa053eHd1bzdwNzQ3TGN5TGdKZWxwY2hveVczQ1p5S0xNdjAyOTZubS9vOGNJMnlUcHRhTjg0T3gxdDczZQppcGdSQTV3SU0vYjI1UjVadlNFMXRRTUR4T3ZQVjkwelJMZmJQNmpqMVNZNW9tSXVLMXBmCi0tLS0tRU5EIFJTQSBQUklWQVRFIEtFWS0tLS0tCg==
JWT_PUBLIC_KEY=LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUF0VEV6d0JEbXFwR1hITlEvZW0xSgpzQ21PUWVQVlY4VWdWVXNMcDJZSWxNTTRaT00yVGFrZ0ltWko2R2dPYXE2VjRxNmhlL3hraWk0c1hsamIrNWUvCmZ1RmtjYktNVnJ0UURHKysyVTBwVkdEak5JZzhLUnd5TTRKVCtDc3NXc1JsUUM2RFRtWHdvWklvWldhOGF0WUUKVWFMOC9IVDVBUE5ORnJjU21iVUhKYTdQUWxscUszK1lmREN5LzIyUnNlcEh1ZzJjN09tR2pBcEhmZitOODdEVQpwczBaUkdsb1B2eVArVmlyRVlhMTc3eloxczQrTTFwanBqTDZvZkFkU2FzNUp3eHZUNjVFNFlkZWZPMy9YTHVWClNuTjdyOHduczFqQWxTeHJuc3pMR0Y1bXRjS3ZMQXBtWUdweFJyYWlrYkRNQWlmYUt1WE5Ob1ROK1l5cFdHS2QKZ1FJREFRQUIKLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg==
  ```
2. Create images and start docker containers
```
make build
make run
```
3.Copy symlink for yml file in peatio container
```
docker exec compose_peatio_1 cp /opt/peatio/config/management_api_v1.yml /home/app/config
docker restart compose_peatio_1
```
4. Start test
```
make jest
```



