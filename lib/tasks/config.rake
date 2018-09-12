require 'erb'
require 'openssl'
require 'base64'

namespace :config do
  desc 'Render configuration files'
  task :render do
    files = [
      'config/peatio.env',
      'config/barong.env',
      'config/toolbox.yaml',
      'config/peatio/management_api_v1.yml'
    ]

    files.each do |file|
      key = OpenSSL::PKey::RSA.generate(2048)

      @jwt_private_key = Base64.urlsafe_encode64(key.to_pem)
      @jwt_public_key  = Base64.urlsafe_encode64(key.public_key.to_pem)

      result = ERB.new(File.read("#{file}.erb")).result(binding)
      File.write(file, result)
    end
  end
end
