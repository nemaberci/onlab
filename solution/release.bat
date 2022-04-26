docker login onlabcontainerregistry.azurecr.io
docker build -t solution:latest .
docker tag solution:latest onlabcontainerregistry.azurecr.io/solution
docker push onlabcontainerregistry.azurecr.io/solution