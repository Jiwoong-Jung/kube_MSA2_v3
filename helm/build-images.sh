#!/bin/bash
set -euo pipefail

# ===================================================
# 🟢 Minikube 완전 자동 배포 스크립트
# - Eureka, Gateway 이미지 빌드
# - Minikube에 로드
# - MySQL Helm 배포
# ===================================================

# --- 1️⃣ Minikube Docker 환경 설정 ---
echo "🔧 Switching Docker environment to Minikube..."
eval "$(minikube docker-env)"

# --- 2️⃣ 유틸 함수: Docker 이미지 빌드 및 Minikube 로드 ---
build_and_load_image() {
    local name=$1
    local context_dir=$2
    local dockerfile_path=$3

    # 절대 경로 계산
    local abs_context
    local abs_dockerfile
    abs_context=$(realpath "$context_dir")
    abs_dockerfile=$(realpath "$dockerfile_path")

    echo "🚀 Building Docker image: $name"
    docker build --no-cache -t "${name}:latest" -f "$abs_dockerfile" "$abs_context"

    echo "📦 Loading $name image into Minikube..."
    minikube image load "${name}:latest"
}

# --- 3️⃣ Eureka 이미지 빌드 & 로드 ---
build_and_load_image "eureka" "../eureka-server" "../eureka-server/Dockerfile"

# --- 4️⃣ Gateway 이미지 빌드 & 로드 ---
build_and_load_image "gateway" "../gateway" "../gateway/Dockerfile"

# --- 5️⃣ 이미지 존재 확인 ---
echo "🔍 Verifying images in Minikube..."
missing_images=false
for img in eureka gateway; do
    if ! minikube image ls | grep -q "^${img}:"; then
        echo "❌ $img image is missing in Minikube!"
        missing_images=true
    fi
done

if [ "$missing_images" = true ]; then
    echo "❌ Some images failed to load into Minikube!"
    exit 1
fi
echo "✅ All images successfully loaded!"

# --- 6️⃣ Kubernetes 네임스페이스 생성 ---
kubectl create namespace microservices --dry-run=client -o yaml | kubectl apply -f -
echo "📂 Namespace 'microservices' is ready."

# --- 7️⃣ MySQL Helm 배포 ---
echo "💾 Deploying MySQL..."
if helm list -n microservices | grep -q "^mysql"; then
    helm uninstall mysql -n microservices
fi

helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

helm install mysql bitnami/mysql \
    --namespace microservices \
    --set primary.persistence.enabled=false \
    --wait

echo "✅ MySQL is deployed."

# --- 8️⃣ 배포 완료 메시지 ---
echo "🎉 Minikube setup complete. You can now deploy your microservices."
echo "💡 Tip: kubectl get pods -n microservices -w"
