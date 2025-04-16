import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  IconButton,
  LinearProgress,
  useTheme,
} from '@mui/material';
import {
  People as PeopleIcon,
  Inventory as InventoryIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { userApi, productApi } from '../services/api';

interface DashboardCard {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  route: string;
}

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, productsResponse] = await Promise.all([
          userApi.getAll(),
          productApi.getAll(),
        ]);
        setUserCount(usersResponse.data.length);
        setProductCount(productsResponse.data.length);
      } catch (error) {
        console.error('데이터 로딩 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const cards: DashboardCard[] = [
    {
      title: '전체 사용자',
      count: userCount,
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.primary.main,
      route: '/users',
    },
    {
      title: '전체 제품',
      count: productCount,
      icon: <InventoryIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.secondary.main,
      route: '/products',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: 'text.primary' }}>
        대시보드
      </Typography>

      {isLoading ? (
        <LinearProgress sx={{ mt: 2 }} />
      ) : (
        <Grid container spacing={3}>
          {cards.map((card, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 16px -4px rgba(0, 0, 0, 0.1)',
                    '& .hover-icon': {
                      transform: 'translateX(0)',
                      opacity: 1,
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '4px',
                    bgcolor: card.color,
                  }}
                />
                <CardContent sx={{ flex: 1, p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: `${card.color}15`,
                        color: card.color,
                      }}
                    >
                      {card.icon}
                    </Box>
                  </Box>
                  <Typography variant="h3" sx={{ mb: 1, fontWeight: 700 }}>
                    {card.count.toLocaleString()}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                    {card.title}
                  </Typography>
                  <IconButton
                    className="hover-icon"
                    onClick={() => navigate(card.route)}
                    sx={{
                      position: 'absolute',
                      right: 16,
                      bottom: 16,
                      bgcolor: card.color,
                      color: 'white',
                      transform: 'translateX(100%)',
                      opacity: 0,
                      transition: 'transform 0.2s, opacity 0.2s',
                      '&:hover': {
                        bgcolor: card.color,
                      },
                    }}
                  >
                    <ArrowForwardIcon />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Dashboard; 