docker login onlabcontainerregistry.azurecr.io
docker build -t user:latest .
docker tag user:latest onlabcontainerregistry.azurecr.io/user
docker push onlabcontainerregistry.azurecr.io/user