import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Box, Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Typography, useMediaQuery, Tooltip, Switch, FormControlLabel, Button, Collapse } from '@mui/material'
import { alpha } from '@mui/material/styles'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import LogoutIcon from '@mui/icons-material/Logout'
import { useAuth } from '../contexts/AuthContext'
import { 
  AnimatedDashboardIcon,
  AnimatedTrendingUpIcon,
  AnimatedInventoryIcon,
  AnimatedShoppingCartIcon,
  AnimatedPaymentIcon,
  AnimatedReceiptIcon,
  AnimatedStoreIcon,
  AnimatedAnalyticsIcon,
  AnimatedUserIcon
} from '../components/AnimatedIcons'

const drawerWidth = 260

export default function SidebarLayout({ children, mode, onToggleMode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const isMdUp = useMediaQuery('(min-width:900px)')
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const navItems = useMemo(() => ([
    { to: '/', label: 'Dashboard', icon: <AnimatedDashboardIcon /> },
  ]), [])

  const reportGroups = useMemo(() => [
    {
      title: 'Sales & Revenue',
      icon: <AnimatedTrendingUpIcon />,
      color: '#22c55e',
      reports: [
        { key: 'sales_report', label: 'Sales Report', icon: <AnimatedTrendingUpIcon /> },
        { key: 'payment_report', label: 'Payment Received', icon: <AnimatedPaymentIcon /> },
        { key: 'pending_report', label: 'Pending Payment', icon: <AnimatedReceiptIcon /> },
        { key: 'debitors_report', label: 'Sundry Debitors', icon: <AnimatedReceiptIcon /> },
      ]
    },
    {
      title: 'Inventory',
      icon: <AnimatedInventoryIcon />,
      color: '#8b5cf6',
      reports: [
        { key: 'stock_report', label: 'Current Stock', icon: <AnimatedInventoryIcon /> },
        { key: 'purchase_report', label: 'Purchase Report', icon: <AnimatedStoreIcon /> },
        { key: 'creditors_report', label: 'Sundry Creditors', icon: <AnimatedReceiptIcon /> },
      ]
    },
    {
      title: 'Orders & Expenses',
      icon: <AnimatedShoppingCartIcon />,
      color: '#3b82f6',
      reports: [
        { key: 'order_report', label: 'Order Report', icon: <AnimatedShoppingCartIcon /> },
        { key: 'petty_expense_report', label: 'Petty Expense', icon: <AnimatedReceiptIcon /> },
        { key: 'daily_activity_report', label: 'Daily Activity', icon: <AnimatedAnalyticsIcon /> },
      ]
    },
    {
      title: 'Human Resources',
      icon: <AnimatedUserIcon />,
      color: '#06b6d4',
      reports: [
        { key: 'hr_report', label: 'HR Attendance', icon: <AnimatedUserIcon /> },
      ]
    }
  ], [])

  const [openGroups, setOpenGroups] = useState({
    'Sales & Revenue': true,
    'Inventory': true,
    'Orders & Expenses': true,
    'Human Resources': true,
  })

  function toggleGroup(groupTitle) {
    setOpenGroups((prev) => ({ ...prev, [groupTitle]: !prev[groupTitle] }))
  }

  function handleReportClick(reportKey) {
    navigate(`/reports?report=${reportKey}`)
    if (!isMdUp) setMobileOpen(false)
  }

  const accent = useMemo(() => {
    return { main: '#4f46e5', alt: '#22d3ee' }
  }, [])

  const onNavigate = () => {
    // Close temporary drawer on mobile when user navigates
    if (!isMdUp) setMobileOpen(false)
  }

  const drawer = (
    <Box role="navigation" sx={{ color: 'text.primary', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, pb: 1.5 }}>
        <Box component={Link} to="/" onClick={onNavigate} sx={{ display: 'block', textDecoration: 'none', mb: 1, '&:hover': { opacity: 0.9 }, cursor: 'pointer' }}>
          <Box
            component="img"
            src="/RS-removebg-preview.png"
            alt="UDHIM Technology"
            sx={{
              width: '100%',
              height: 'auto',
              maxWidth: { xs: 180, md: 200 },
              maxHeight: { xs: 60, md: 80 },
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 900,
            letterSpacing: 0.7,
            color: (theme) => theme.palette.text.primary,
          }}
        >
          Electronic Store
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: .2, lineHeight: 1.25 }}>
          Dashboard & Analytics
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ 
        flexGrow: 1, 
        overflowY: 'auto', 
        display: 'flex', 
        flexDirection: 'column',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}>
        <List sx={{ px: 1.25, py: 0.5 }}>
          {/* Dashboard Link */}
        {navItems.map((item) => {
          const isSelected = location.pathname === item.to
          return (
            <ListItemButton
              key={item.to}
              component={Link}
              to={item.to}
              onClick={onNavigate}
              selected={isSelected}
              sx={{
                my: 0.25,
                borderRadius: 2,
                transition: 'all .2s ease',
                height: 40,
                px: 1.25,
                '& .MuiListItemText-primary': { fontWeight: 700, fontSize: 13, letterSpacing: .3 },
                '&:hover': {
                  backgroundColor: (theme) => alpha(accent.main, theme.palette.mode === 'light' ? 0.10 : 0.22),
                  transform: 'translateX(2px)'
                },
                '&.Mui-selected': {
                  backgroundColor: (theme) => alpha(accent.main, theme.palette.mode === 'light' ? 0.18 : 0.30),
                  color: accent.main,
                  '& .MuiListItemIcon-root': { color: accent.main },
                  borderLeft: `3px solid ${accent.main}`,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          )
        })}

        <Divider sx={{ my: 1 }} />

        {/* Report Groups */}
        {reportGroups.map((group) => {
          const isOpen = openGroups[group.title]
          return (
            <Box key={group.title}>
              <ListItemButton
                onClick={() => toggleGroup(group.title)}
                sx={{
                  my: 0.25,
                  borderRadius: 2,
                  transition: 'all .2s ease',
                  minHeight: 40,
                  px: 1.25,
                  backgroundColor: (theme) => alpha(group.color, theme.palette.mode === 'light' ? 0.08 : 0.15),
                  '& .MuiListItemText-primary': { fontWeight: 700, fontSize: 13, letterSpacing: .3, textTransform: 'uppercase' },
                  '&:hover': {
                    backgroundColor: (theme) => alpha(group.color, theme.palette.mode === 'light' ? 0.15 : 0.25),
                    transform: 'translateX(2px)'
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: group.color }}>{group.icon}</ListItemIcon>
                <ListItemText primary={group.title} sx={{ color: group.color }} />
                {isOpen ? <ExpandLess sx={{ color: group.color }} /> : <ExpandMore sx={{ color: group.color }} />}
              </ListItemButton>
              
              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {group.reports.map((report) => {
                    const isSelected = location.search.includes(`report=${report.key}`)
                    return (
                      <ListItemButton
                        key={report.key}
                        onClick={() => handleReportClick(report.key)}
                        selected={isSelected}
                        sx={{
                          pl: 4,
                          my: 0.25,
                          borderRadius: 2,
                          transition: 'all .2s ease',
                          minHeight: 36,
                          '& .MuiListItemText-primary': { fontWeight: 600, fontSize: 13 },
                          '&:hover': {
                            backgroundColor: (theme) => alpha(group.color, theme.palette.mode === 'light' ? 0.10 : 0.20),
                            transform: 'translateX(4px)'
                          },
                          '&.Mui-selected': {
                            backgroundColor: (theme) => alpha(group.color, theme.palette.mode === 'light' ? 0.20 : 0.30),
                            color: group.color,
                            '& .MuiListItemIcon-root': { color: group.color },
                            borderLeft: `3px solid ${group.color}`,
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 32, fontSize: 18 }}>{report.icon}</ListItemIcon>
                        <ListItemText primary={report.label} />
                      </ListItemButton>
                    )
                  })}
                </List>
              </Collapse>
            </Box>
          )
        })}
        </List>
      </Box>
      <Divider />
      
      {/* User Info and Logout */}
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
          Logged in as:
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 700, color: accent.main }}>
          {user?.username || 'User'}
        </Typography>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={logout}
          sx={{
            mt: 2,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            borderColor: 'error.main',
            color: 'error.main',
            '&:hover': {
              borderColor: 'error.dark',
              backgroundColor: 'rgba(211, 47, 47, 0.04)',
              transform: 'translateY(-1px)'
            },
            transition: 'all 0.2s ease'
          }}
        >
          Logout
        </Button>
      </Box>
      
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, letterSpacing: .3 }}>Appearance</Typography>
        <Tooltip title={mode === 'light' ? 'Switch to dark' : 'Switch to light'}>
          <FormControlLabel
            control={<Switch checked={mode === 'dark'} onChange={onToggleMode} />}
            label={mode === 'dark' ? 'Dark' : 'Light'}
          />
        </Tooltip>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: (theme) => theme.palette.background.default }}>
      <Box component="nav" sx={{ width: { md: collapsed ? 0 : drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: { xs: '88vw', sm: drawerWidth },
              background: (theme) => theme.palette.mode === 'light'
                ? `linear-gradient(180deg, #ffffff 0%, #f7fbff 50%, #f3f4ff 100%), radial-gradient(1200px 300px at -200px -100px, ${alpha(accent.main, .12)} 0%, transparent 60%)`
                : `linear-gradient(180deg, #0f172a 0%, #0b1324 50%, #0a0f1f 100%), radial-gradient(1200px 300px at -200px -100px, ${alpha(accent.main, .18)} 0%, transparent 60%)`,
              borderRight: (theme) => `1px solid ${alpha(accent.main, theme.palette.mode === 'light' ? 0.25 : 0.35)}`,
              boxShadow: (theme) => theme.palette.mode === 'light' ? '0 10px 30px rgba(2,6,23,.08)' : '0 10px 30px rgba(0,0,0,.6)',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }
          }}
        >
          {drawer}
        </Drawer>
        {!collapsed && (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
                background: (theme) => theme.palette.mode === 'light'
                  ? `linear-gradient(180deg, #ffffff 0%, #f7fbff 50%, #f3f4ff 100%), radial-gradient(1200px 300px at -200px -100px, ${alpha(accent.main, .12)} 0%, transparent 60%)`
                  : `linear-gradient(180deg, #0f172a 0%, #0b1324 50%, #0a0f1f 100%), radial-gradient(1200px 300px at -200px -100px, ${alpha(accent.main, .18)} 0%, transparent 60%)`,
                borderRight: (theme) => `1px solid ${alpha(accent.main, theme.palette.mode === 'light' ? 0.25 : 0.35)}`,
                boxShadow: (theme) => theme.palette.mode === 'light' ? '0 10px 30px rgba(2,6,23,.08)' : '0 10px 30px rgba(0,0,0,.6)',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
              }
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 0, width: { md: collapsed ? '100%' : `calc(100% - ${drawerWidth}px)` } }}>
        {!isMdUp && !mobileOpen && (
          <Box sx={{ 
            position: 'fixed', 
            top: 12, 
            left: 12, 
            zIndex: (theme) => theme.zIndex.drawer - 1 
          }}>
            <IconButton 
              onClick={() => setMobileOpen(true)} 
              aria-label="open sidebar"
              sx={{
                bgcolor: 'background.paper',
                border: (theme) => `2px solid ${alpha(accent.main, 0.3)}`,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                color: accent.main,
                '&:hover': {
                  bgcolor: alpha(accent.main, 0.1),
                  borderColor: accent.main,
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s ease'
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        )}
        {/* Desktop fixed toggle near divider */}
        {isMdUp && (
          <Tooltip title={collapsed ? 'Open sidebar' : 'Close sidebar'}>
            <IconButton
              onClick={() => setCollapsed((v) => !v)}
              aria-label={collapsed ? 'open sidebar' : 'close sidebar'}
              sx={{
                position: 'fixed',
                top: 8,
                left: collapsed ? 8 : drawerWidth + 12,
                zIndex: (theme) => theme.zIndex.drawer + 1,
                bgcolor: 'background.paper',
                border: `1px solid ${alpha(accent.main, 0.35)}`,
                boxShadow: (theme) => theme.palette.mode === 'light' ? '0 6px 16px rgba(2,6,23,.08)' : '0 6px 16px rgba(0,0,0,.45)'
              }}
            >
              {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </Tooltip>
        )}
        <Box sx={{ width: '100%', height: '100%' }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}


