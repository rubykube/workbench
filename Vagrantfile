Vagrant.configure("2") do |config|
  config.vm.box = "rubykube/workbench"
  config.vm.box_version = "1.0.1"

  config.vm.network "forwarded_port", guest: 8000, host: 8000
  config.vm.network "forwarded_port", guest: 8001, host: 8001
  config.vm.network "forwarded_port", guest: 8002, host: 8002
end
