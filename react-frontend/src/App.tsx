import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button, Container, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Users from './pages/Users';
import Products from './pages/Products';
import Dashboard from './pages/Dashboard';
import { Home as HomeIcon } from '@mui/icons-material';

// 테마 설정
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

// React Router future flags 설정
const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
};

// App 컴포넌트: 애플리케이션의 메인 컴포넌트
function App() {
  return (
    // ThemeProvider: Material-UI 테마 적용
    <ThemeProvider theme={theme}>
      {/* CssBaseline: CSS 초기화 */}
      <CssBaseline />
      
      {/* Router: 라우팅 기능 제공 */}
      <Router {...router}>
        <Box sx={{ flexGrow: 1, height: '100vh', display: 'flex', flexDirection: 'column' }}>
          {/* AppBar: 상단 네비게이션 바 */}
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                MSA 관리 시스템
              </Typography>
              {/* 네비게이션 링크 */}
              <Button 
                color="inherit" 
                component={Link} 
                to="/"
                startIcon={<HomeIcon />}
                sx={{ mr: 2 }}
              >
                홈
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/users"
                sx={{ mr: 2 }}
              >
                사용자 관리
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/products"
              >
                제품 관리
              </Button>
            </Toolbar>
          </AppBar>

          {/* 메인 컨텐츠 영역 */}
          <Box sx={{ flex: 1, overflow: 'auto', bgcolor: 'background.default' }}>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              {/* Routes: 페이지 라우팅 설정 */}
              <Routes>
                <Route path="/users" element={<Users />} />
                <Route path="/products" element={<Products />} />
                {/* 기본 경로를 대시보드로 설정 */}
                <Route path="/" element={<Dashboard />} />
              </Routes>
            </Container>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App; 