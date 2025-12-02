import { Box, Button, Grid, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ReportRunner from '../shared/ReportRunner'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function ReportsPage() {
  const [params, setParams] = useSearchParams()
  const selectedReport = params.get('report') || ''

  const reportGroups = useMemo(() => [
    {
      title: 'Sales & Revenue',
      color: '#22c55e',
      icon: TrendingUpIcon,
      reports: [
        { key: 'sales_report', label: 'Sales Report', needsDateRange: true, icon: TrendingUpIcon },
        { key: 'payment_report', label: 'Payment Received', needsDateRange: true, icon: TrendingUpIcon },
        { key: 'pending_report', label: 'Pending Payment', needsDateRange: false, icon: TrendingUpIcon },
        { key: 'debitors_report', label: 'Sundry Debitors', needsDateRange: true, icon: TrendingUpIcon },
      ]
    },
    {
      title: 'Purchase & Inventory',
      color: '#8b5cf6',
      icon: AnalyticsIcon,
      reports: [
        { key: 'purchase_report', label: 'Purchase Report', needsDateRange: true, icon: AnalyticsIcon },
        { key: 'stock_report', label: 'Current Stock', needsDateRange: false, icon: AnalyticsIcon },
        { key: 'creditors_report', label: 'Sundry Creditors', needsDateRange: true, icon: AnalyticsIcon },
      ]
    },
    {
      title: 'Orders & Expenses',
      color: '#3b82f6',
      icon: AnalyticsIcon,
      reports: [
        { key: 'order_report', label: 'Order Report', needsDateRange: false, icon: AnalyticsIcon },
        { key: 'petty_expense_report', label: 'Petty Expense', needsDateRange: true, icon: AnalyticsIcon },
        { key: 'daily_activity_report', label: 'Daily Activity', needsDateRange: true, icon: AnalyticsIcon },
      ]
    },
    {
      title: 'Human Resources',
      color: '#f59e0b',
      icon: AnalyticsIcon,
      reports: [
        { key: 'hr_report', label: 'HR Attendance', needsDateRange: false, needsMonthYear: true, icon: AnalyticsIcon },
      ]
    }
  ], [])

  function accentFor(key) {
    const map = {
      sales_report: { main: '#22c55e', alt: '#06b6d4', Icon: TrendingUpIcon },
      purchase_report: { main: '#f59e0b', alt: '#ef4444', Icon: AnalyticsIcon },
      stock_report: { main: '#8b5cf6', alt: '#06b6d4', Icon: AnalyticsIcon },
      payment_report: { main: '#10b981', alt: '#f59e0b', Icon: AnalyticsIcon },
      pending_report: { main: '#ef4444', alt: '#f97316', Icon: AnalyticsIcon },
      order_report: { main: '#3b82f6', alt: '#10b981', Icon: AnalyticsIcon },
      petty_expense_report: { main: '#f59e0b', alt: '#ef4444', Icon: AnalyticsIcon },
      creditors_report: { main: '#ec4899', alt: '#8b5cf6', Icon: AnalyticsIcon },
      debitors_report: { main: '#06b6d4', alt: '#22c55e', Icon: TrendingUpIcon },
      hr_report: { main: '#f59e0b', alt: '#ef4444', Icon: AnalyticsIcon },
      daily_activity_report: { main: '#10b981', alt: '#06b6d4', Icon: AnalyticsIcon },
    }
    return map[key] || { main: '#6366f1', alt: '#22d3ee', Icon: AnalyticsIcon }
  }

  function openReport(key) {
    params.set('report', key)
    setParams(params, { replace: true })
  }

  function backToGrid() {
    params.delete('report')
    setParams(params, { replace: true })
  }

  const selectedReportLabel = useMemo(() => {
    for (const group of reportGroups) {
      const found = group.reports.find(r => r.key === selectedReport)
      if (found) return found.label
    }
    return ''
  }, [reportGroups, selectedReport])

  return (
    <Box sx={{ 
      height: '100vh', 
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {!selectedReport ? (
        <>
          {/* Header */}
          <Box sx={{ textAlign: 'center', py: { xs: 1.5, md: 2.5 }, px: { xs: 2, md: 3 }, flexShrink: 0 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 900, 
                fontSize: { xs: 20, sm: 24, md: 30 },
                mb: 0.5,
                background: 'linear-gradient(135deg, #4f46e5, #22d3ee)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Electronic Store Reports
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: 12, md: 14 } }}>
              Select a report to view detailed analytics
            </Typography>
          </Box>

          {/* Report Groups - Scrollable */}
          <Box sx={{ 
            flexGrow: 1, 
            overflowY: 'auto',
            overflowX: 'hidden',
            px: { xs: 1.5, md: 2.5 },
            pb: { xs: 1.5, md: 2.5 },
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: (theme) => alpha(theme.palette.primary.main, 0.3),
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: (theme) => alpha(theme.palette.primary.main, 0.5),
            }
          }}>
            <Box>
              {reportGroups.map((group) => (
                <Box key={group.title} sx={{ mb: { xs: 2.5, md: 3.5 } }}>
                  {/* Group Header */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1, 
                    mb: { xs: 1.25, md: 1.75 },
                    px: { xs: 0.5, md: 0 }
                  }}>
                    <group.icon sx={{ fontSize: { xs: 20, md: 24 }, color: group.color }} />
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 800, 
                        fontSize: { xs: 15, sm: 17, md: 19 },
                        color: group.color
                      }}
                    >
                      {group.title}
                    </Typography>
                  </Box>

                  {/* Report Cards */}
                  <Grid container spacing={{ xs: 1.25, sm: 1.75, md: 2 }}>
                    {group.reports.map((report) => {
                      const { main, alt } = accentFor(report.key)
                      return (
                        <Grid item xs={12} sm={6} md={4} key={report.key}>
                          <Button
                            fullWidth
                            onClick={() => openReport(report.key)}
                            sx={{
                              height: { xs: 70, sm: 80, md: 90 },
                              borderRadius: 2,
                              background: `linear-gradient(135deg, ${main}, ${alt})`,
                              boxShadow: `0 3px 10px ${alpha(main, 0.2)}`,
                              transition: 'all 0.25s ease',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: { xs: 0.5, md: 0.75 },
                              p: { xs: 1.5, md: 2 },
                              '&:hover': {
                                transform: 'translateY(-3px)',
                                boxShadow: `0 6px 20px ${alpha(main, 0.3)}`,
                              }
                            }}
                          >
                            <report.icon sx={{ fontSize: { xs: 26, sm: 30, md: 34 }, color: 'white' }} />
                            <Typography 
                              sx={{ 
                                fontWeight: 700, 
                                fontSize: { xs: 11.5, sm: 12.5, md: 13.5 },
                                color: 'white',
                                textTransform: 'none',
                                letterSpacing: 0.2,
                                lineHeight: 1.3
                              }}
                            >
                              {report.label}
                            </Typography>
                          </Button>
                        </Grid>
                      )
                    })}
                  </Grid>
                </Box>
              ))}
            </Box>
          </Box>
        </>
      ) : (
        <Box sx={{ 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden',
          maxWidth: '100vw'
        }}>
          {/* Report Header - Fixed */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            gap: { xs: 1.5, md: 2 },
            px: { xs: 2, md: 3 },
            py: { xs: 2, md: 2.5 },
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
            flexShrink: 0,
            zIndex: 1,
            position: 'relative',
            pointerEvents: 'auto',
            cursor: 'default'
          }}>
            <Button 
              onClick={backToGrid} 
              variant="contained"
              startIcon={<ArrowBackIcon />}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: { xs: 13, md: 15 },
                px: { xs: 3, md: 4 },
                py: { xs: 1, md: 1.25 },
                background: '#4f46e5',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                '&:hover': {
                  background: '#4338ca',
                  boxShadow: '0 6px 16px rgba(79, 70, 229, 0.4)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              Back to Reports
            </Button>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 900,
                fontSize: { xs: 22, sm: 26, md: 32 },
                background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: 0.5,
                textAlign: 'center'
              }}
            >
              {selectedReportLabel}
            </Typography>
          </Box>
          
          {/* Report Content - Scrollable */}
          <Box 
            id="report-scroll-container"
            sx={{ 
              flexGrow: 1, 
              overflowY: 'auto',
              overflowX: 'hidden',
              WebkitOverflowScrolling: 'touch',
              maxWidth: '100vw'
            }}
          >
            <ReportRunner selectedReport={selectedReport} />
          </Box>
        </Box>
      )}
    </Box>
  )
}
