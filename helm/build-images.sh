#!/bin/bash
set -e

echo "🔧 Switching Docker environment to Minikube..."
eval $(minikube docker-env)

# --- Function to build image safely ---
build_image() {
    local name=$1
    local path=$2
    local dockerfile=$3

    echo "🚀 Building $name image..."
    docker build -t ${name}:latest -f $dockerfile $path
    if [ $? -ne 0 ]; then
        echo "❌ Failed to build ${name} image"
        exit 1
    fi

    echo "📦 Loading $name image into Minikube..."
    minikube image load ${name}:latest
    if [ $? -ne 0 ]; then
        echo "❌ Failed to load ${name} image"
        exit 1
    fi
}

# --- Build Eureka ---
build_image "eureka" "../eureka-server" "../eureka-server/Dockerfile"

# --- Build Gateway ---
build_image "gateway" "../gateway" "../gateway/Dockerfile"

echo "🔍 Verifying images in Minikube..."
minikube image ls | grep -E "eureka|gateway"

echo "✅ All images have been built and loaded successfully!"
