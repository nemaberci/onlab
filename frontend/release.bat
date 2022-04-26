docker login onlabcontainerregistry.azurecr.io
docker build -t frontend:latest .
docker tag frontend:latest onlabcontainerregistry.azurecr.io/frontend
docker push onlabcontainerregistry.azurecr.io/frontend