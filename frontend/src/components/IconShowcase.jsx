import { Box, Typography, Grid, Paper } from '@mui/material'
import { iconMap, colorThemes } from '../utils/iconMapping'

export const IconShowcase = () => {
  const groupedIcons = Object.entries(iconMap).reduce((acc, [name, config]) => {
    if (!acc[config.category]) {
      acc[config.category] = []
    }
    acc[config.category].push({ name, ...config })
    return acc
  }, {})

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Animated Icon Library
      </Typography>
      
      {Object.entries(groupedIcons).map(([category, icons]) => (
        <Box key={category} sx={{ mb: 4 }}>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              mb: 2, 
              color: colorThemes[category],
              fontWeight: 'bold',
              textTransform: 'capitalize'
            }}
          >
            {category} Icons
          </Typography>
          
          <Grid container spacing={2}>
            {icons.map(({ name, component: IconComponent, color }) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={name}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    border: `2px solid transparent`,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 8px 25px ${color}40`,
                      borderColor: color,
                    }
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 60,
                      mb: 1,
                      borderRadius: 2,
                      backgroundColor: `${color}15`,
                    }}
                  >
                    <IconComponent size={32} />
                  </Box>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontWeight: 600,
                      color: 'text.secondary',
                      textTransform: 'capitalize'
                    }}
                  >
                    {name}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
      
      <Box sx={{ mt: 4, p: 3, backgroundColor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Usage Example:
        </Typography>
        <Box component="pre" sx={{ 
          backgroundColor: 'grey.100', 
          p: 2, 
          borderRadius: 1, 
          fontSize: '0.875rem',
          overflow: 'auto'
        }}>
{`import { getIcon, getIconColor } from '../utils/iconMapping'

// Use in your components:
const MyComponent = () => (
  <div style={{ color: getIconColor('dashboard') }}>
    {getIcon('dashboard', 24)}
    <span>Dashboard</span>
  </div>
)`}
        </Box>
      </Box>
    </Box>
  )
}