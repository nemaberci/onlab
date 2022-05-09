docker login onlabcontainerregistry.azurecr.io
docker build -t mailer:latest .
docker tag mailer:latest onlabcontainerregistry.azurecr.io/mailer
docker push onlabcontainerregistry.azurecr.io/mailer