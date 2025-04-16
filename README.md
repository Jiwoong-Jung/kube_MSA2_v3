# MSA 프로젝트 Helm 배포 가이드

이 프로젝트는 Spring Cloud 기반의 MSA(Microservice Architecture) 애플리케이션을 Kubernetes 환경에 배포하기 위한 Helm 차트를 제공합니다.

## 사전 요구사항

- Docker
- Kubernetes (minikube)
- Helm 3.x
- kubectl
- Node.js (프론트엔드 개발용)

## Node.js 설치 가이드 (Ubuntu)

### NVM을 사용한 Node.js 설치

1. 시스템 업데이트:
```bash
sudo apt update
sudo apt upgrade -y
```

2. NVM 설치를 위한 필수 패키지 설치:
```bash
sudo apt install curl
```

3. NVM 설치:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

4. NVM을 현재 셸에서 사용할 수 있도록 설정:
```bash
source ~/.bashrc
```

5. 설치된 NVM 버전 확인:
```bash
nvm --version
```

6. Node.js 설치 (LTS 버전):
```bash
nvm install 18  # LTS 버전 설치
```

7. 설치된 Node.js 버전 확인:
```bash
node -v
npm -v
```

8. 특정 버전의 Node.js 사용:
```bash
nvm use 18  # Node.js 18 버전 사용
```

### 추가 명령어

- 다른 Node.js 버전 설치:
```bash
nvm install 16  # Node.js 16 버전 설치
nvm install 20  # Node.js 20 버전 설치
```

- 설치된 Node.js 버전 목록 확인:
```bash
nvm ls
```

- 기본 Node.js 버전 설정:
```bash
nvm alias default 18  # Node.js 18을 기본 버전으로 설정
```

- 글로벌 npm 패키지 설치:
```bash
npm install -g yarn  # 예: yarn 설치
```

### 주의사항

1. NVM을 설치한 후에는 터미널을 재시작하거나 `source ~/.bashrc`를 실행해야 합니다.
2. 프로젝트마다 다른 Node.js 버전이 필요한 경우, 프로젝트 디렉토리에서 `nvm use <version>`을 실행하여 버전을 변경할 수 있습니다.
3. 시스템 전체에 Node.js를 설치하려면 다음 명령어를 사용할 수 있습니다:
```bash
sudo apt install nodejs npm
```
하지만 이 방법은 버전 관리가 어렵기 때문에 NVM 사용을 추천합니다.

## 프로젝트 구조

```
.
├── eureka-server/          # Eureka 서비스 디스커버리 서버
├── gateway/               # API Gateway 서비스
├── frontend/              # Vue.js 프론트엔드
└── helm/                  # Helm 차트
    ├── eureka/            # Eureka 서비스 Helm 차트
    ├── gateway/           # Gateway 서비스 Helm 차트
    ├── build-images.sh    # Docker 이미지 빌드 스크립트
    ├── cleanup.sh         # 리소스 정리 스크립트
    └── deploy.sh          # 배포 스크립트
```

## 배포 방법

### 1. JAR 파일 준비
- Eureka 서비스 JAR 파일을 `eureka-server/build/libs/` 폴더에 복사
- Gateway 서비스 JAR 파일을 `gateway/build/libs/` 폴더에 복사

### 2. 배포 스크립트 실행
```bash
# 스크립트 실행 권한 부여
chmod +x helm/*.sh

# 배포 실행
./helm/deploy.sh
```

배포 스크립트는 다음 작업을 순차적으로 수행합니다:
1. 기존 리소스 정리 (Helm 릴리즈, 네임스페이스, Docker 이미지)
2. Docker 이미지 빌드 및 Minikube에 로드
3. microservices 네임스페이스 생성
4. Eureka 서비스 배포
5. Gateway 서비스 배포
6. 배포 상태 확인

### 3. 외부 접속 방법

#### 방법 1: minikube service 명령어 사용
```bash
minikube service gateway -n microservices
```
이 명령어는 자동으로 브라우저를 열어 Gateway 서비스에 접속할 수 있는 URL을 제공합니다.

#### 방법 2: minikube tunnel 사용
```bash
# 터미널 1: 터널 실행
minikube tunnel

# 터미널 2: 서비스 상태 확인
kubectl get svc gateway -n microservices
```
터널을 실행한 후 EXTERNAL-IP를 통해 접속할 수 있습니다:
- http://EXTERNAL-IP:9898/api/users
- http://EXTERNAL-IP:9898/api/products

주의: minikube tunnel은 백그라운드에서 계속 실행되어야 하며, 터널을 종료하면 외부 접속이 중단됩니다.

## 리소스 정리
모든 리소스를 정리하려면 다음 명령어를 실행합니다:
```bash
./helm/cleanup.sh
```

## 서비스 상태 확인
```bash
# 모든 리소스 상태 확인
kubectl get all -n microservices

# Gateway 서비스 상태 확인
kubectl get svc gateway -n microservices
```

## 서비스 스케일링

### Gateway 서비스 레플리카 수 조정
Gateway 서비스의 레플리카 수를 조정하려면 다음 단계를 따르세요:

1. `helm/gateway/values.yaml` 파일에서 `replicaCount` 값을 수정합니다.
2. 다음 명령어로 변경사항을 적용합니다:
   ```bash
   helm upgrade gateway ./helm/gateway -n microservices
   ```
3. 변경된 레플리카 수를 확인합니다:
   ```bash
   kubectl get pods -n microservices | grep gateway
   ```

## Helm 차트 관리

### 차트 업그레이드

설정을 변경한 후 차트를 업그레이드합니다:

```bash
helm upgrade msa-app ./helm
```

### 차트 삭제

배포된 차트를 삭제합니다:

```bash
helm uninstall msa-app -n msa-namespace
```

## 설정 변경

`helm/values.yaml` 파일을 수정하여 다음 설정을 변경할 수 있습니다:

- 네임스페이스
- 이미지 태그
- 서비스 포트
- 환경 변수
- 레플리카 수

## 문제 해결

### 일반적인 문제

1. JAR 파일 없음
   - 각 서비스의 build/libs 디렉토리에 JAR 파일이 있는지 확인
   - JAR 파일 이름이 올바른지 확인 (eureka-server-*.jar, gateway-*.jar)

2. Dockerfile 문제
   - Dockerfile이 올바른 위치에 있는지 확인
   - JAR 파일 경로가 Dockerfile과 일치하는지 확인

3. 이미지 로드 실패
   - minikube가 실행 중인지 확인
   - Docker 이미지가 올바르게 빌드되었는지 확인

4. 서비스 접속 불가
   - 서비스 상태 확인: `kubectl get svc -n msa-namespace`
   - 포드 상태 확인: `kubectl get pods -n msa-namespace`
   - 로그 확인: `kubectl logs <pod-name> -n msa-namespace`

### 로그 확인

```bash
# Eureka 서버 로그
kubectl logs -f deployment/eureka-server -n msa-namespace

# Gateway 서비스 로그
kubectl logs -f deployment/gateway -n msa-namespace
```

## 참고사항

- 이 Helm 차트는 개발 환경을 위한 기본 설정을 제공합니다.
- 프로덕션 환경에서는 보안 설정, 리소스 제한, 모니터링 등을 추가로 구성해야 합니다.
- 필요에 따라 `values.yaml` 파일의 설정을 수정하여 환경에 맞게 조정할 수 있습니다.

## 데이터베이스 설정

### MySQL 데이터베이스 설정

1. MySQL Helm 차트 설치:
```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install mysql bitnami/mysql -n microservices -f helm/mysql/values.yaml
```

2. 데이터베이스 연결 정보:
- 호스트: mysql.microservices.svc.cluster.local
- 포트: 3306
- 데이터베이스: msa_db
- 사용자: msa_user
- 비밀번호: msa_password

3. Gateway 서비스의 application.properties에 다음 설정을 추가:
```properties
spring.datasource.url=jdbc:mysql://mysql.microservices.svc.cluster.local:3306/msa_db
spring.datasource.username=msa_user
spring.datasource.password=msa_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
```

## 초기 데이터 설정

### SQL 스크립트를 통한 초기 데이터 삽입

1. MySQL Pod에 접속:
```bash
kubectl exec -it mysql-0 -n microservices -- mysql -u msa_user -pmsa_password msa_db
```

2. 다음 SQL을 실행하여 초기 데이터를 삽입:
```sql
-- 사용자 데이터
INSERT INTO users (username, password, name, email) VALUES
('user1', 'password1', '홍길동', 'user1@example.com'),
('user2', 'password2', '김철수', 'user2@example.com');

-- 상품 데이터
INSERT INTO products (name, description, price, stock) VALUES
('노트북', '고성능 노트북', 1500000, 10),
('스마트폰', '최신 스마트폰', 1000000, 20);
```

### data.sql 파일을 통한 초기 데이터 삽입

1. `gateway/src/main/resources/data.sql` 파일을 생성하고 다음 내용을 추가:
```sql
-- 사용자 데이터
INSERT INTO users (username, password, name, email) VALUES
('user1', 'password1', '홍길동', 'user1@example.com'),
('user2', 'password2', '김철수', 'user2@example.com');

-- 상품 데이터
INSERT INTO products (name, description, price, stock) VALUES
('노트북', '고성능 노트북', 1500000, 10),
('스마트폰', '최신 스마트폰', 1000000, 20);
```

2. `application.yml`에 다음 설정 추가:
```yaml
spring:
  sql:
    init:
      mode: always
```

3. 서비스를 재배포:
```bash
cd gateway
./gradlew clean build
cd ../helm
./build-images.sh
./deploy.sh
```

## 모니터링 및 관리 도구

### 1. Kubernetes Dashboard

Kubernetes 공식 대시보드를 설치하고 사용하는 방법:

```bash
# 대시보드 설치
minikube dashboard

# 또는 수동으로 설치
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml

# 대시보드 접근을 위한 프록시 실행
kubectl proxy
```

대시보드는 다음 URL에서 접근 가능:
- http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/http:kubernetes-dashboard:/proxy/

### 2. Lens IDE

Lens는 Kubernetes 클러스터를 관리하기 위한 강력한 데스크톱 애플리케이션입니다.

1. [Lens 공식 웹사이트](https://k8slens.dev/)에서 다운로드
2. 설치 후 Minikube 클러스터에 연결
3. 모든 리소스를 시각적으로 모니터링 가능

### 3. k9s (터미널 기반 모니터링)

k9s는 터미널에서 Kubernetes 클러스터를 모니터링할 수 있는 도구입니다.

```bash
# k9s 설치 (macOS)
brew install k9s

# k9s 설치 (Linux)
curl -sS https://webinstall.dev/k9s | bash

# k9s 실행
k9s
```

### 4. Prometheus & Grafana

시스템 메트릭을 모니터링하기 위한 도구:

```bash
# Prometheus 설치
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/prometheus

# Grafana 설치
helm repo add grafana https://grafana.github.io/helm-charts
helm install grafana grafana/grafana
```

### 5. kubectl 명령어 모니터링

기본적인 모니터링을 위한 kubectl 명령어:

```bash
# 모든 리소스 상태 확인
kubectl get all -n microservices

# Pod 로그 확인
kubectl logs -f <pod-name> -n microservices

# Pod 상세 정보 확인
kubectl describe pod <pod-name> -n microservices

# 리소스 사용량 확인
kubectl top pods -n microservices
kubectl top nodes
```

## MySQL 접속 방법

### 1. 포트 포워딩을 통한 접속

```bash
# MySQL 서비스 포트 포워딩
kubectl port-forward svc/mysql 3306:3306 -n microservices
```

이제 로컬에서 다음 정보로 접속 가능:
- 호스트: localhost
- 포트: 3306
- 사용자: msa_user
- 비밀번호: msa_password
- 데이터베이스: msa_db

예시 (MySQL 클라이언트 사용):
```bash
mysql -h localhost -P 3306 -u msa_user -pmsa_password msa_db
```

### 2. MySQL Pod에 직접 접속

```bash
# MySQL Pod에 접속
kubectl exec -it mysql-0 -n microservices -- mysql -u msa_user -pmsa_password msa_db
```

### 3. MySQL 서비스에 접속

서비스 정보 확인:
```bash
kubectl get svc mysql -n microservices
```

내부 클러스터에서 접속 시:
- 호스트: mysql.microservices.svc.cluster.local
- 포트: 3306

### 4. MySQL Workbench 사용

1. MySQL Workbench 설치
2. 새로운 연결 생성
3. 다음 정보 입력:
   - Connection Name: Minikube MySQL
   - Connection Method: Standard TCP/IP
   - Hostname: localhost (포트 포워딩 사용 시)
   - Port: 3306
   - Username: msa_user
   - Password: msa_password
   - Default Schema: msa_db

### 5. DBeaver 사용

1. DBeaver 설치
2. 새로운 연결 생성
3. MySQL 선택
4. 다음 정보 입력:
   - Host: localhost
   - Port: 3306
   - Database: msa_db
   - Username: msa_user
   - Password: msa_password

### 주의사항

1. 포트 포워딩을 사용할 때는 다른 MySQL 서비스가 3306 포트를 사용하지 않도록 주의
2. 보안을 위해 프로덕션 환경에서는 적절한 네트워크 정책 설정 필요
3. 외부 접속이 필요한 경우 LoadBalancer 타입으로 서비스 변경 필요 