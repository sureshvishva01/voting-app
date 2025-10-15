#!/bin/bash
# Replace with your Docker Hub username
DOCKER_USER=rssureshkumar

# Services
SERVICES=("vote" "result" "worker" "ui")

# Build and push each service
for SERVICE in "${SERVICES[@]}"; do
    echo "=========================="
    echo "Building $SERVICE"
    docker build -t $DOCKER_USER/voting-app-$SERVICE:latest ./$SERVICE
    echo "Pushing $SERVICE to Docker Hub"
    docker push $DOCKER_USER/voting-app-$SERVICE:latest
done

echo "All images built and pushed successfully!"
