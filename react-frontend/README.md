# React Frontend

이 프로젝트는 MSA 구조의 프론트엔드 부분으로, React와 TypeScript를 사용하여 구현되었습니다.

## 기술 스택

- React 18
- TypeScript
- Vite
- Material-UI (MUI)
- Axios
- React Router DOM

## 설치 방법

1. Node.js 설치 (v14.0.0 이상)
   - https://nodejs.org 에서 다운로드 및 설치

2. 프로젝트 클론
   ```bash
   git clone <repository-url>
   cd react-frontend
   ```

3. 의존성 패키지 설치
   ```bash
   npm install
   ```

## 실행 방법

1. 개발 서버 실행
   ```bash
   npm run dev
   ```
   - 기본적으로 http://localhost:5173 에서 실행됩니다.

2. 프로덕션 빌드
   ```bash
   npm run build
   ```

## 프로젝트 구조

```
react-frontend/
├── src/
│   ├── components/     # 재사용 가능한 컴포넌트
│   ├── pages/         # 페이지 컴포넌트
│   ├── services/      # API 통신 관련 서비스
│   ├── utils/         # 유틸리티 함수
│   ├── App.tsx        # 메인 앱 컴포넌트
│   └── main.tsx       # 앱 진입점
├── public/            # 정적 파일
└── package.json       # 프로젝트 설정 및 의존성
```

## 주요 기능

- 사용자 관리 (목록/추가/수정/삭제)
- 제품 관리 (목록/추가/수정/삭제)
- Material-UI를 활용한 모던한 UI
- 반응형 디자인 