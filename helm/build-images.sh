#!/bin/bash
set -e

echo "🔧 Switching Docker environment to Minikube..."
eval $(minikube docker-env)

# --- Function to build image safely ---
build_image() {
    local name=$1
    local path=$2
    local dockerfile=$3

    # 절대 경로 계산
    local abs_path
    abs_path=$(realpath "$path")
    local abs_dockerfile
    abs_dockerfile=$(realpath "$dockerfile")

    echo "🚀 Building $name image..."
    docker build -t "${name}:latest" -f "$abs_dockerfile" "$abs_path"

    echo "📦 Checking if $name image exists in Minikube..."
    if ! minikube image ls | grep -q "^${name}:"; then
        echo "⚠ $name image not found in Minikube, loading..."
        minikube image load "${name}:latest"
    fi
}

# --- Build Eureka ---
build_image "eureka" "../eureka-server" "../eureka-server/Dockerfile"

# --- Build Gateway ---
build_image "gateway" "../gateway" "../gateway/Dockerfile"

echo "🔍 Verifying images in Minikube..."
if minikube image ls | grep -q "^eureka:" && minikube image ls | grep -q "^gateway:"; then
    echo "✅ All images have been built and loaded successfully!"
else
    echo "❌ Some images are missing in Minikube!"
    exit 1
fi
