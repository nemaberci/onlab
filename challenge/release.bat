docker login onlabcontainerregistry.azurecr.io
docker build -t challenge:latest .
docker tag challenge:latest onlabcontainerregistry.azurecr.io/challenge
docker push onlabcontainerregistry.azurecr.io/challenge