import { Box, Stack, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import StoreIcon from '@mui/icons-material/Store'
import AnalyticsIcon from '@mui/icons-material/Analytics'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: `url('/bg_image.webp')`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      '&:before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        background: (theme) => theme.palette.mode === 'light'
          ? 'linear-gradient(0deg, rgba(255,255,255,0.88), rgba(255,255,255,0.88))'
          : 'linear-gradient(0deg, rgba(2,6,23,0.80), rgba(2,6,23,0.80))',
        pointerEvents: 'none'
      }
    }}>
      <Stack 
        spacing={{ xs: 2.5, md: 3.5 }} 
        alignItems="center" 
        sx={{ 
          position: 'relative', 
          mx: 'auto', 
          width: '100%', 
          maxWidth: 700, 
          px: { xs: 3, sm: 4 }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 1.5, md: 2 }, 
          flexDirection: { xs: 'column', sm: 'row' }
        }}>
          <StoreIcon sx={{ fontSize: { xs: 44, md: 60 }, color: '#4f46e5' }} />
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 900, 
              letterSpacing: .5, 
              fontSize: { xs: 34, sm: 40, md: 52 },
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            Electronic Store
          </Typography>
        </Box>
        
        <Typography 
          variant="h5" 
          color="text.secondary" 
          sx={{ 
            textAlign: 'center', 
            fontWeight: 600,
            fontSize: { xs: 22, md: 26 }
          }}
        >
          Dashboard & Analytics
        </Typography>
        
        <Typography 
          color="text.secondary" 
          sx={{ 
            textAlign: 'center', 
            maxWidth: 550,
            fontSize: { xs: 15, md: 17 },
            lineHeight: 1.7
          }}
        >
          Access comprehensive reports, analytics, and insights for your electronic store operations.
        </Typography>
        
        <Button
          variant="contained"
          size="large"
          startIcon={<AnalyticsIcon />}
          onClick={() => navigate('/reports')}
          sx={{
            mt: { xs: 1.5, md: 2 },
            px: { xs: 4, md: 6 },
            py: { xs: 1.5, md: 2 },
            fontSize: { xs: 17, md: 19 },
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 1.2,
            background: 'linear-gradient(90deg, #4f46e5, #22d3ee)',
            boxShadow: '0 8px 20px rgba(79, 70, 229, 0.3)',
            borderRadius: 2.5,
            transition: 'all 0.3s ease',
            '&:hover': {
              filter: 'brightness(1.08)',
              transform: 'translateY(-3px)',
              boxShadow: '0 14px 28px rgba(79, 70, 229, 0.4)'
            }
          }}
        >
          View Reports
        </Button>
      </Stack>
    </Box>
  )
}


