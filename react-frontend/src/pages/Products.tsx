import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { productApi } from '../services/api';

// 제품 인터페이스 정의
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
}

// 초기 제품 폼 상태
const initialProductForm = {
  id: 0,
  name: '',
  price: 0,
  description: '',
  stock: 0
};

// Products 컴포넌트: 제품 관리 페이지
const Products = () => {
  // 상태 관리
  const [products, setProducts] = useState<Product[]>([]); // 제품 목록
  const [open, setOpen] = useState(false); // 다이얼로그 열림 상태
  const [productForm, setProductForm] = useState(initialProductForm); // 제품 폼 데이터
  const [isEdit, setIsEdit] = useState(false); // 수정 모드 여부
  const [snackbar, setSnackbar] = useState({ // 알림 메시지 상태
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // 컴포넌트 마운트 시 제품 목록 조회
  useEffect(() => {
    fetchProducts();
  }, []);

  // 제품 목록 조회 함수
  const fetchProducts = async () => {
    try {
      const response = await productApi.getAll();
      setProducts(response.data);
    } catch (error) {
      showSnackbar('제품 목록을 불러오는데 실패했습니다.', 'error');
    }
  };

  // 제품 추가 다이얼로그 열기
  const handleAdd = () => {
    setIsEdit(false);
    setProductForm(initialProductForm);
    setOpen(true);
  };

  // 제품 수정 다이얼로그 열기
  const handleEdit = (product: Product) => {
    setIsEdit(true);
    setProductForm({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      stock: product.stock,
    });
    setOpen(true);
  };

  // 제품 삭제 처리
  const handleDelete = async (product: Product) => {
    try {
      await productApi.delete(product.id);
      showSnackbar('제품이 삭제되었습니다.');
      fetchProducts();
    } catch (error) {
      showSnackbar('제품 삭제에 실패했습니다.', 'error');
    }
  };

  // 폼 제출 처리
  const handleSubmit = async () => {
    try {
      if (isEdit) {
        // 수정 모드: PUT 요청
        await productApi.update(productForm.id, productForm);
        showSnackbar('제품 정보가 수정되었습니다.');
      } else {
        // 추가 모드: POST 요청
        await productApi.create(productForm);
        showSnackbar('새 제품이 추가되었습니다.');
      }
      setOpen(false);
      fetchProducts();
    } catch (error) {
      showSnackbar(
        isEdit ? '제품 수정에 실패했습니다.' : '제품 추가에 실패했습니다.',
        'error'
      );
    }
  };

  // 알림 메시지 표시 함수
  const showSnackbar = (message: string, severity: 'success' | 'error' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // 알림 메시지 닫기 함수
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      {/* 헤더 영역 */}
      <Box sx={{
        p: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #f1f5f9',
      }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
          제품 목록
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{
            px: 3,
            py: 1,
            boxShadow: '0 8px 16px -4px rgba(33, 150, 243, 0.2)',
            '&:hover': {
              boxShadow: '0 8px 16px -4px rgba(33, 150, 243, 0.4)',
            },
          }}
        >
          새 제품
        </Button>
      </Box>

      {/* 테이블 영역 */}
      <TableContainer component={Paper} sx={{ mt: 3, boxShadow: 'none', border: '1px solid #f1f5f9' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f8fafc' }}>
            <TableRow>
              <TableCell width="8%" sx={{ fontWeight: 'bold', borderBottom: '1px solid #f1f5f9' }}>번호</TableCell>
              <TableCell width="20%" sx={{ fontWeight: 'bold', borderBottom: '1px solid #f1f5f9' }}>제품명</TableCell>
              <TableCell width="15%" sx={{ fontWeight: 'bold', borderBottom: '1px solid #f1f5f9' }} align="right">가격</TableCell>
              <TableCell width="12%" sx={{ fontWeight: 'bold', borderBottom: '1px solid #f1f5f9' }} align="right">재고</TableCell>
              <TableCell width="30%" sx={{ fontWeight: 'bold', borderBottom: '1px solid #f1f5f9' }}>설명</TableCell>
              <TableCell width="15%" sx={{ fontWeight: 'bold', borderBottom: '1px solid #f1f5f9' }} align="right">작업</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow 
                key={product.id}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: '#f8fafc',
                    transition: 'background-color 0.2s ease-in-out'
                  }
                }}
              >
                <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>{product.id}</TableCell>
                <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>{product.name}</TableCell>
                <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }} align="right">
                  {product.price.toLocaleString()}원
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }} align="right">
                  {product.stock}
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>{product.description}</TableCell>
                <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }} align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(product)}
                    size="small"
                    sx={{
                      mr: 1,
                      '&:hover': {
                        backgroundColor: 'primary.light',
                        color: 'white',
                      },
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(product)}
                    size="small"
                    sx={{
                      '&:hover': {
                        backgroundColor: '#ef5350',
                        color: 'white',
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 제품 추가/수정 다이얼로그 */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: '600px',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid #f1f5f9',
          backgroundColor: '#f8fafc',
          py: 2
        }}>
          {isEdit ? '제품 수정' : '새 제품 추가'}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              mt: 2,
              '& .MuiTextField-root': {
                minHeight: {
                  name: '80px',
                  price: '80px',
                  description: '150px'
                }
              },
              '& .MuiFormLabel-root': {
                color: 'text.primary',
                transform: 'translate(14px, 24px) scale(1)',
                '&.MuiInputLabel-shrink': {
                  transform: 'translate(14px, -6px) scale(0.75)'
                }
              },
              '& .MuiInputBase-input': {
                color: 'text.primary',
                padding: '24px 14px 8px'
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'divider',
                  top: -5
                },
                '&:hover fieldset': {
                  borderColor: 'primary.main'
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main'
                }
              }
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              fullWidth
              label="제품명"
              value={productForm.name}
              onChange={(e) =>
                setProductForm({ ...productForm, name: e.target.value })
              }
              variant="outlined"
            />
            <TextField
              fullWidth
              label="가격"
              type="number"
              value={productForm.price}
              onChange={(e) =>
                setProductForm({ ...productForm, price: Number(e.target.value) })
              }
              InputProps={{
                endAdornment: <InputAdornment position="end">원</InputAdornment>,
              }}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="재고"
              type="number"
              value={productForm.stock}
              onChange={(e) =>
                setProductForm({ ...productForm, stock: Number(e.target.value) })
              }
              variant="outlined"
            />
            <TextField
              fullWidth
              label="설명"
              multiline
              rows={6}
              value={productForm.description}
              onChange={(e) =>
                setProductForm({ ...productForm, description: e.target.value })
              }
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          borderTop: '1px solid #f1f5f9',
          backgroundColor: '#f8fafc',
          px: 3,
          py: 2
        }}>
          <Button
            onClick={() => setOpen(false)}
            sx={{
              borderColor: '#e2e8f0',
              color: '#64748b',
              '&:hover': {
                borderColor: '#cbd5e1',
                backgroundColor: '#f8fafc',
                boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
              }
            }}
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              backgroundColor: '#3b82f6',
              '&:hover': {
                backgroundColor: '#2563eb',
                boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
              }
            }}
          >
            저장
          </Button>
        </DialogActions>
      </Dialog>

      {/* 알림 메시지 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: '#1e293b',
            color: '#ffffff',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
          }
        }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Products; 