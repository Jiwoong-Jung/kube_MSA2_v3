import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
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
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { userApi } from '../services/api';

// 사용자 인터페이스 정의
interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  email: string;
}

// 초기 사용자 폼 상태
const initialUserForm = {
  id: 0,
  username: '',
  password: '',
  name: '',
  email: '',
};

// Users 컴포넌트: 사용자 관리 페이지
const Users = () => {
  // 상태 관리
  const [users, setUsers] = useState<User[]>([]); // 사용자 목록
  const [open, setOpen] = useState(false); // 다이얼로그 열림 상태
  const [userForm, setUserForm] = useState(initialUserForm); // 사용자 폼 데이터
  const [isEdit, setIsEdit] = useState(false); // 수정 모드 여부
  const [snackbar, setSnackbar] = useState({ // 알림 메시지 상태
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // 컴포넌트 마운트 시 사용자 목록 조회
  useEffect(() => {
    fetchUsers();
  }, []);

  // 사용자 목록 조회 함수
  const fetchUsers = async () => {
    try {
      const response = await userApi.getAll();
      setUsers(response.data);
    } catch (error) {
      showSnackbar('사용자 목록을 불러오는데 실패했습니다.', 'error');
    }
  };

  // 사용자 추가 다이얼로그 열기
  const handleAdd = () => {
    setIsEdit(false);
    setUserForm(initialUserForm);
    setOpen(true);
  };

  // 사용자 수정 다이얼로그 열기
  const handleEdit = (user: User) => {
    setIsEdit(true);
    setUserForm({
      id: user.id,
      username: user.username,
      password: user.password,
      name: user.name,
      email: user.email,
    });
    setOpen(true);
  };

  // 사용자 삭제 처리
  const handleDelete = async (user: User) => {
    try {
      await userApi.delete(user.id);
      showSnackbar('사용자가 삭제되었습니다.');
      fetchUsers();
    } catch (error) {
      showSnackbar('사용자 삭제에 실패했습니다.', 'error');
    }
  };

  // 폼 제출 처리
  const handleSubmit = async () => {
    try {
      if (isEdit) {
        // 수정 모드: PUT 요청
        await userApi.update(userForm.id, userForm);
        showSnackbar('사용자 정보가 수정되었습니다.');
      } else {
        // 추가 모드: POST 요청
        await userApi.create(userForm);
        showSnackbar('새 사용자가 추가되었습니다.');
      }
      setOpen(false);
      fetchUsers();
    } catch (error) {
      showSnackbar(
        isEdit ? '사용자 수정에 실패했습니다.' : '사용자 추가에 실패했습니다.',
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
          사용자 목록
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
          새 사용자
        </Button>
      </Box>

      {/* 테이블 영역 */}
      <TableContainer 
        sx={{ 
          height: 'calc(100vh - 250px)', 
          overflow: 'auto',
          backgroundColor: 'white',
          borderRadius: 1,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f5f9',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#cbd5e1',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: '#94a3b8',
            },
          },
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell 
                width="10%" 
                sx={{ 
                  fontWeight: 'bold',
                  backgroundColor: '#f8fafc',
                  borderBottom: '2px solid #e2e8f0'
                }}
              >
                ID
              </TableCell>
              <TableCell 
                width="20%" 
                sx={{ 
                  fontWeight: 'bold',
                  backgroundColor: '#f8fafc',
                  borderBottom: '2px solid #e2e8f0'
                }}
              >
                사용자명
              </TableCell>
              <TableCell 
                width="20%" 
                sx={{ 
                  fontWeight: 'bold',
                  backgroundColor: '#f8fafc',
                  borderBottom: '2px solid #e2e8f0'
                }}
              >
                이름
              </TableCell>
              <TableCell 
                width="30%" 
                sx={{ 
                  fontWeight: 'bold',
                  backgroundColor: '#f8fafc',
                  borderBottom: '2px solid #e2e8f0'
                }}
              >
                이메일
              </TableCell>
              <TableCell 
                width="20%" 
                align="center"
                sx={{ 
                  fontWeight: 'bold',
                  backgroundColor: '#f8fafc',
                  borderBottom: '2px solid #e2e8f0'
                }}
              >
                작업
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow 
                key={user.id}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: '#f8fafc',
                    transition: 'all 0.2s ease-in-out',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px -2px rgba(0, 0, 0, 0.1)',
                  }
                }}
              >
                <TableCell sx={{ 
                  borderBottom: '1px solid #f1f5f9',
                  transition: 'all 0.2s ease-in-out'
                }}>
                  {user.id}
                </TableCell>
                <TableCell sx={{ 
                  borderBottom: '1px solid #f1f5f9',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  minWidth: '150px',
                  transition: 'all 0.2s ease-in-out'
                }}>
                  {user.username}
                </TableCell>
                <TableCell sx={{ 
                  borderBottom: '1px solid #f1f5f9',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  minWidth: '150px',
                  transition: 'all 0.2s ease-in-out'
                }}>
                  {user.name}
                </TableCell>
                <TableCell sx={{ 
                  borderBottom: '1px solid #f1f5f9',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  minWidth: '200px',
                  transition: 'all 0.2s ease-in-out'
                }}>
                  {user.email}
                </TableCell>
                <TableCell 
                  align="center" 
                  sx={{ 
                    borderBottom: '1px solid #f1f5f9',
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(user)}
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
                    onClick={() => handleDelete(user)}
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

      {/* 사용자 추가/수정 다이얼로그 */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            minHeight: '500px',
            '& .MuiDialogContent-root': {
              padding: '24px',
            },
          },
        }}
      >
        <DialogTitle sx={{
          p: 3,
          backgroundColor: 'background.default',
          fontWeight: 700,
        }}>
          {isEdit ? '사용자 수정' : '새 사용자 추가'}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            <TextField
              fullWidth
              label="사용자명"
              value={userForm.username}
              onChange={(e) =>
                setUserForm({ ...userForm, username: e.target.value })
              }
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                },
                '& .MuiFormLabel-root': {
                  top: -6,
                },
                '& .MuiInputLabel-shrink': {
                  top: 0,
                },
                minHeight: '80px',
              }}
            />
            <TextField
              fullWidth
              label="비밀번호"
              type="password"
              value={userForm.password}
              onChange={(e) =>
                setUserForm({ ...userForm, password: e.target.value })
              }
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                },
                '& .MuiFormLabel-root': {
                  top: -6,
                },
                '& .MuiInputLabel-shrink': {
                  top: 0,
                },
                minHeight: '80px',
              }}
            />
            <TextField
              fullWidth
              label="이름"
              value={userForm.name}
              onChange={(e) =>
                setUserForm({ ...userForm, name: e.target.value })
              }
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                },
                '& .MuiFormLabel-root': {
                  top: -6,
                },
                '& .MuiInputLabel-shrink': {
                  top: 0,
                },
                minHeight: '80px',
              }}
            />
            <TextField
              fullWidth
              label="이메일"
              type="email"
              value={userForm.email}
              onChange={(e) =>
                setUserForm({ ...userForm, email: e.target.value })
              }
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                },
                '& .MuiFormLabel-root': {
                  top: -6,
                },
                '& .MuiInputLabel-shrink': {
                  top: 0,
                },
                minHeight: '80px',
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{
          p: 3,
          backgroundColor: 'background.default',
        }}>
          <Button
            onClick={() => setOpen(false)}
            variant="outlined"
            sx={{
              color: 'text.secondary',
              borderColor: 'divider',
              '&:hover': {
                backgroundColor: 'background.default',
                borderColor: 'text.secondary',
              },
            }}
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              px: 3,
              boxShadow: '0 8px 16px -4px rgba(33, 150, 243, 0.2)',
              '&:hover': {
                boxShadow: '0 8px 16px -4px rgba(33, 150, 243, 0.4)',
              },
            }}
          >
            {isEdit ? '수정' : '추가'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 알림 메시지 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: '100%',
            boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.1)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Users; 