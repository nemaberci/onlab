docker login onlabcontainerregistry.azurecr.io
docker build -t comment:latest .
docker tag comment:latest onlabcontainerregistry.azurecr.io/comment
docker push onlabcontainerregistry.azurecr.io/comment