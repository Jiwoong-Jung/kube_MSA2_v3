import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite 설정
export default defineConfig({
  // React 플러그인 사용
  plugins: [react()],
  
  // 개발 서버 설정
  server: {
    // 포트 설정
    port: 5173,
    // CORS 설정
    proxy: {
      // API 요청 프록시 설정
      '/api': {
        target: 'http://localhost:9898',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  
  // 빌드 설정
  build: {
    // 빌드 결과물 최적화
    minify: 'terser',
    // 청크 크기 경고 임계값
    chunkSizeWarningLimit: 1000,
  },
}); 