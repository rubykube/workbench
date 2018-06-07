Vagrant.configure("2") do |config|
  config.vm.box = "rubykube/workbench"
  config.vm.box_version = "1.0.1"

  config.vm.network "forwarded_port", guest: 8000, host: 8000
  config.vm.network "forwarded_port", guest: 8001, host: 8001
  config.vm.network "forwarded_port", guest: 3000, host: 3000
  config.vm.network "forwarded_port", guest: 8200, host: 8200
  config.vm.network "forwarded_port", guest: 80,   host: 1234
  config.vm.network "forwarded_port", guest: 4000, host: 4000

end
