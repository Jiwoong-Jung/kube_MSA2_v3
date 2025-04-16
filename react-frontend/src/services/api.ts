import axios from 'axios';

// API 기본 설정
const api = axios.create({
  // 백엔드 서버 주소 설정
  baseURL: 'http://localhost:9898',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 사용자 관련 API
export const userApi = {
  // 모든 사용자 조회
  getAll: () => api.get('/api/users'),
  
  // 특정 사용자 조회
  getById: (id: number) => api.get(`/api/users/${id}`),
  
  // 새 사용자 생성
  create: (data: any) => api.post('/api/users', data),
  
  // 사용자 정보 수정
  update: (id: number, data: any) => api.put(`/api/users/${id}`, data),
  
  // 사용자 삭제
  delete: (id: number) => api.delete(`/api/users/${id}`),
};

// 제품 관련 API
export const productApi = {
  // 모든 제품 조회
  getAll: () => api.get('/api/products'),
  
  // 특정 제품 조회
  getById: (id: number) => api.get(`/api/products/${id}`),
  
  // 새 제품 생성
  create: (data: any) => api.post('/api/products', data),
  
  // 제품 정보 수정
  update: (id: number, data: any) => api.put(`/api/products/${id}`, data),
  
  // 제품 삭제
  delete: (id: number) => api.delete(`/api/products/${id}`),
};

export default api; 