# Set your Docker Hub username here
$DOCKER_USER = "rssureshkumar"

# List of apps to build
$apps = @("vote", "result", "worker", "ui")

foreach ($app in $apps) {
    # Ensure the app name is not empty
    if ([string]::IsNullOrWhiteSpace($app)) {
        Write-Host "Skipping empty app name"
        continue
    }

    $imageTag = "$DOCKER_USER/voting-app-$app"

    Write-Host "=========================="
    Write-Host "Building $app"

    # Build the Docker image
    docker build -t $imageTag .\$app
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to build $app"
        continue
    }

    Write-Host "Pushing $app to Docker Hub"
    # Push the Docker image
    docker push $imageTag
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to push $app"
        continue
    }
}

Write-Host "All images built and pushed successfully!"
