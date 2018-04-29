namespace :jwt do
  desc 'Generate keypairs for Barong, Peatio and Jest'
  task :generate do
    puts '=== Generating RSA keypair ==='
    sh 'openssl genrsa -out ./config/rsa.key 2048'
    sh 'openssl rsa -in ./config/rsa.key -outform PEM -pubout -out ./config/rsa.key.pub'
  end

  desc 'Configure Barong, Peatio and tests to use the keypair'
  task :enable do
    puts '=== Adding the keypair to configuration ==='

    dot_env = File.read('.env').lines.reject { |l| l =~ /^(JWT_SHARED_SECRET_KEY|JWT_PUBLIC_KEY)=/ }

    dot_env << "JWT_SHARED_SECRET_KEY=#{%x(cat config/rsa.key | base64 -w0)}\n"
    dot_env << "JWT_PUBLIC_KEY=#{%x(cat config/rsa.key.pub | base64 -w0)}\n"

    File.write('.env', dot_env.join)
  end
end

desc 'Generate and enable a new JWT keypair'
task jwt: %w[jwt:generate jwt:enable]

