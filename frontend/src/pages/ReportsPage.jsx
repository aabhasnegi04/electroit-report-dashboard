import { Box, Button, Grid, Typography, Card, CardContent, Chip, Paper } from '@mui/material'
import { alpha } from '@mui/material/styles'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ReportRunner from '../shared/ReportRunner'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  AnimatedTrendingUpIcon,
  AnimatedInventoryIcon,
  AnimatedShoppingCartIcon,
  AnimatedPaymentIcon,
  AnimatedReceiptIcon,
  AnimatedStoreIcon,
  AnimatedAnalyticsIcon,
  AnimatedUserIcon,
  AnimatedReportsIcon,
  AnimatedTodoIcon
} from '../components/AnimatedIcons'

// Add keyframes for animations
const keyframes = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`

// Inject keyframes into document head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = keyframes
  document.head.appendChild(styleSheet)
}

export default function ReportsPage() {
  const [params, setParams] = useSearchParams()
  const selectedReport = params.get('report') || ''
  const [reportGenerated, setReportGenerated] = useState(false)

  const reportGroups = useMemo(() => [
    {
      title: 'Sales & Revenue',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      icon: AnimatedTrendingUpIcon,
      description: 'Track sales performance and revenue streams',
      reports: [
        { 
          key: 'sales_report', 
          label: 'Sales Report', 
          description: 'Comprehensive sales analytics',
          needsDateRange: true, 
          icon: AnimatedTrendingUpIcon,
          color: '#10b981'
        },
        { 
          key: 'payment_report', 
          label: 'Payment Received', 
          description: 'Track incoming payments',
          needsDateRange: true, 
          icon: AnimatedPaymentIcon,
          color: '#06b6d4'
        },
        { 
          key: 'pending_report', 
          label: 'Pending Payment', 
          description: 'Outstanding payment tracking',
          needsDateRange: false, 
          icon: AnimatedReceiptIcon,
          color: '#ec4899'
        },
        { 
          key: 'debitors_report', 
          label: 'Sundry Debitors', 
          description: 'Customer debt analysis',
          needsDateRange: true, 
          icon: AnimatedReceiptIcon,
          color: '#f59e0b'
        },
        { 
          key: 'collection_report', 
          label: 'Collection by Person', 
          description: 'Payment collection tracking by person',
          needsDateRange: true, 
          icon: AnimatedPaymentIcon,
          color: '#8b5cf6'
        },
        { 
          key: 'collection_brand_report', 
          label: 'Collection by Brand', 
          description: 'Payment collection tracking by brand',
          needsDateRange: true, 
          icon: AnimatedAnalyticsIcon,
          color: '#f97316'
        },
      ]
    },
    {
      title: 'Purchase & Inventory',
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      icon: AnimatedInventoryIcon,
      description: 'Manage inventory and purchase operations',
      reports: [
        { 
          key: 'purchase_report', 
          label: 'Purchase Report', 
          description: 'Purchase order analytics',
          needsDateRange: true, 
          icon: AnimatedStoreIcon,
          color: '#6366f1'
        },
        { 
          key: 'stock_report', 
          label: 'Current Stock', 
          description: 'Real-time inventory levels',
          needsDateRange: false, 
          icon: AnimatedInventoryIcon,
          color: '#8b5cf6'
        },
        { 
          key: 'creditors_report', 
          label: 'Sundry Creditors', 
          description: 'Supplier payment tracking',
          needsDateRange: true, 
          icon: AnimatedReceiptIcon,
          color: '#ec4899'
        },
      ]
    },
    {
      title: 'Orders & Expenses',
      color: '#f97316',
      gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      icon: AnimatedShoppingCartIcon,
      description: 'Monitor orders and expense management',
      reports: [
        { 
          key: 'order_report', 
          label: 'Order Report', 
          description: 'Order processing analytics',
          needsDateRange: false, 
          icon: AnimatedShoppingCartIcon,
          color: '#f97316'
        },
        { 
          key: 'petty_expense_report', 
          label: 'Petty Expense', 
          description: 'Small expense tracking',
          needsDateRange: true, 
          icon: AnimatedReceiptIcon,
          color: '#ec4899'
        },
        { 
          key: 'daily_activity_report', 
          label: 'Daily Activity', 
          description: 'Daily operations overview',
          needsDateRange: true, 
          icon: AnimatedAnalyticsIcon,
          color: '#ef4444'
        },
        { 
          key: 'todo_report', 
          label: 'TO DO LIST', 
          description: 'TODO items with action history',
          needsDateRange: true, 
          icon: AnimatedTodoIcon,
          color: '#64748b'
        },
      ]
    },
    {
      title: 'Human Resources',
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      icon: AnimatedUserIcon,
      description: 'Employee management and attendance',
      reports: [
        { 
          key: 'hr_report', 
          label: 'HR Attendance', 
          description: 'Employee attendance tracking',
          needsDateRange: false, 
          needsMonthYear: true, 
          icon: AnimatedUserIcon,
          color: '#06b6d4'
        },
      ]
    }
  ], [])

  function accentFor(key) {
    const map = {
      sales_report: { main: '#10b981', alt: '#059669', Icon: AnimatedTrendingUpIcon },
      purchase_report: { main: '#6366f1', alt: '#4f46e5', Icon: AnimatedStoreIcon },
      stock_report: { main: '#8b5cf6', alt: '#7c3aed', Icon: AnimatedInventoryIcon },
      payment_report: { main: '#06b6d4', alt: '#0891b2', Icon: AnimatedPaymentIcon },
      pending_report: { main: '#ec4899', alt: '#db2777', Icon: AnimatedReceiptIcon },
      order_report: { main: '#f97316', alt: '#ea580c', Icon: AnimatedShoppingCartIcon },
      petty_expense_report: { main: '#ec4899', alt: '#db2777', Icon: AnimatedReceiptIcon },
      creditors_report: { main: '#ec4899', alt: '#db2777', Icon: AnimatedReceiptIcon },
      debitors_report: { main: '#f59e0b', alt: '#d97706', Icon: AnimatedReceiptIcon },
      collection_report: { main: '#8b5cf6', alt: '#7c3aed', Icon: AnimatedPaymentIcon },
      collection_brand_report: { main: '#f97316', alt: '#ea580c', Icon: AnimatedAnalyticsIcon },
      hr_report: { main: '#06b6d4', alt: '#0891b2', Icon: AnimatedUserIcon },
      daily_activity_report: { main: '#ef4444', alt: '#dc2626', Icon: AnimatedAnalyticsIcon },
      todo_report: { main: '#64748b', alt: '#475569', Icon: AnimatedTodoIcon },
    }
    return map[key] || { main: '#6366f1', alt: '#4f46e5', Icon: AnimatedReportsIcon }
  }

  function openReport(key) {
    params.set('report', key)
    setParams(params, { replace: true })
    setReportGenerated(false) // Reset when opening a new report
  }

  function backToGrid() {
    params.delete('report')
    setParams(params, { replace: true })
    setReportGenerated(false) // Reset when going back
  }

  function handleReportGenerated(success) {
    setReportGenerated(success)
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
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(circle at 25% 25%, rgba(79, 70, 229, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(34, 211, 238, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 75% 25%, rgba(236, 72, 153, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 25% 75%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)
        `,
        pointerEvents: 'none',
        zIndex: 0
      }
    }}>
      {!selectedReport ? (
        <Box sx={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ 
            textAlign: 'center', 
            py: { xs: 1.5, md: 2 }, 
            px: { xs: 2, md: 3 }, 
            flexShrink: 0,
            background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #fdf4ff 100%)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 20% 20%, rgba(79, 70, 229, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(34, 211, 238, 0.1) 0%, transparent 50%)',
              pointerEvents: 'none'
            }
          }}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                <AnimatedReportsIcon size={32} />
              </Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 900, 
                  fontSize: { xs: 18, sm: 20, md: 24 },
                  mb: 0.5,
                  background: 'linear-gradient(135deg, #4f46e5, #22d3ee, #ec4899)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.5px'
                }}
              >
                Electronic Store Reports
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  fontSize: { xs: 12, md: 14 },
                  fontWeight: 500,
                  maxWidth: 500,
                  mx: 'auto'
                }}
              >
                Comprehensive analytics and insights
              </Typography>
            </Box>
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
              {reportGroups.map((group, groupIndex) => (
                <Box key={group.title} sx={{ mb: { xs: 4, md: 5 } }}>
                  {/* Group Header Card */}
                  <Paper
                    elevation={0}
                    sx={{
                      background: group.gradient,
                      borderRadius: 2,
                      p: { xs: 1.5, md: 2 },
                      mb: { xs: 1.5, md: 2 },
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '80px',
                        height: '80px',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
                        borderRadius: '50%',
                        transform: 'translate(25px, -25px)'
                      }
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1.5,
                      position: 'relative',
                      zIndex: 1
                    }}>
                      <Box sx={{ 
                        p: 1, 
                        borderRadius: 1.5, 
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)'
                      }}>
                        <group.icon size={24} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 800, 
                            fontSize: { xs: 14, sm: 16, md: 18 },
                            color: 'white',
                            mb: 0.25,
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                        >
                          {group.title}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'rgba(255,255,255,0.9)',
                            fontSize: { xs: 11, md: 12 },
                            fontWeight: 500
                          }}
                        >
                          {group.description}
                        </Typography>
                      </Box>
                      <Chip 
                        label={`${group.reports.length}`}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          fontWeight: 600,
                          backdropFilter: 'blur(10px)',
                          fontSize: '0.75rem'
                        }}
                      />
                    </Box>
                  </Paper>

                  {/* Report Cards */}
                  <Grid container spacing={{ xs: 2, sm: 2, md: 2.5 }}>
                    {group.reports.map((report, reportIndex) => {
                      const { main, alt, Icon } = accentFor(report.key)
                      return (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={report.key}>
                          <Card
                            onClick={() => openReport(report.key)}
                            sx={{
                              height: 180,
                              width: '100%',
                              borderRadius: 2,
                              background: `linear-gradient(135deg, ${main}15 0%, ${alt}25 100%)`,
                              border: `2px solid ${main}30`,
                              cursor: 'pointer',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              position: 'relative',
                              overflow: 'hidden',
                              animation: `slideInUp 0.6s ease-out ${(groupIndex * 0.1) + (reportIndex * 0.1)}s both`,
                              '&:hover': {
                                transform: 'translateY(-6px) scale(1.02)',
                                boxShadow: `0 15px 30px ${alpha(main, 0.3)}`,
                                borderColor: main,
                                '& .report-icon': {
                                  transform: 'scale(1.1) rotate(5deg)',
                                },
                                '& .report-bg': {
                                  transform: 'scale(1.1)',
                                  opacity: 0.8
                                }
                              },
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: -40,
                                right: -40,
                                width: 80,
                                height: 80,
                                background: `radial-gradient(circle, ${main}20 0%, transparent 70%)`,
                                borderRadius: '50%',
                                className: 'report-bg',
                                transition: 'all 0.3s ease'
                              }
                            }}
                          >
                            <CardContent sx={{ 
                              p: 2,
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              position: 'relative',
                              zIndex: 1,
                              '&:last-child': { pb: 2 }
                            }}>
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'flex-start',
                                justifyContent: 'space-between',
                                mb: 1.5
                              }}>
                                <Box
                                  className="report-icon"
                                  sx={{
                                    p: 1,
                                    borderRadius: 1.5,
                                    background: `linear-gradient(135deg, ${main}, ${alt})`,
                                    boxShadow: `0 3px 8px ${alpha(main, 0.3)}`,
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  <Icon size={24} />
                                </Box>
                                {(report.needsDateRange || report.needsMonthYear) && (
                                  <Chip 
                                    label={report.needsMonthYear ? "Monthly" : "Date"}
                                    size="small"
                                    sx={{
                                      backgroundColor: `${main}20`,
                                      color: main,
                                      fontWeight: 600,
                                      fontSize: '0.7rem',
                                      height: 20
                                    }}
                                  />
                                )}
                              </Box>
                              
                              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <Typography 
                                  variant="h6"
                                  sx={{ 
                                    fontWeight: 700, 
                                    fontSize: 14,
                                    color: 'text.primary',
                                    mb: 0.75,
                                    lineHeight: 1.2
                                  }}
                                >
                                  {report.label}
                                </Typography>
                                <Typography 
                                  variant="body2"
                                  sx={{ 
                                    color: 'text.secondary',
                                    fontSize: 11,
                                    fontWeight: 500,
                                    lineHeight: 1.3,
                                    flex: 1
                                  }}
                                >
                                  {report.description}
                                </Typography>
                              </Box>

                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                mt: 1,
                                pt: 1,
                                borderTop: `1px solid ${main}20`
                              }}>
                                <Typography 
                                  variant="caption"
                                  sx={{
                                    color: main,
                                    fontWeight: 600,
                                    fontSize: '0.7rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: 0.3
                                  }}
                                >
                                  Click to View
                                </Typography>
                                <Box sx={{
                                  width: 5,
                                  height: 5,
                                  borderRadius: '50%',
                                  backgroundColor: main,
                                  animation: 'pulse 2s infinite'
                                }} />
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      )
                    })}
                  </Grid>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      ) : (
        <Box sx={{ 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden',
          maxWidth: '100vw'
        }}>
          {/* Report Header - Only show if report hasn't been generated */}
          {!reportGenerated && (
            <Paper
              elevation={0}
              sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                gap: { xs: 2, md: 3 },
                px: { xs: 2, md: 4 },
                py: { xs: 3, md: 4 },
                background: (() => {
                  const { main, alt } = accentFor(selectedReport)
                  return `linear-gradient(135deg, ${main}10 0%, ${alt}20 50%, #f8fafc 100%)`
                })(),
                flexShrink: 0,
                zIndex: 1,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: (() => {
                    const { main } = accentFor(selectedReport)
                    return `radial-gradient(circle at 20% 20%, ${main}15 0%, transparent 50%), radial-gradient(circle at 80% 80%, ${main}10 0%, transparent 50%)`
                  })(),
                  pointerEvents: 'none'
                }
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%' }}>
                <Button 
                  onClick={backToGrid} 
                  variant="contained"
                  startIcon={<ArrowBackIcon />}
                  sx={{ 
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: { xs: 14, md: 16 },
                    px: { xs: 3, md: 5 },
                    py: { xs: 1.25, md: 1.5 },
                    background: (() => {
                      const { main, alt } = accentFor(selectedReport)
                      return `linear-gradient(135deg, ${main}, ${alt})`
                    })(),
                    boxShadow: (() => {
                      const { main } = accentFor(selectedReport)
                      return `0 6px 20px ${alpha(main, 0.3)}`
                    })(),
                    mb: 2,
                    '&:hover': {
                      boxShadow: (() => {
                        const { main } = accentFor(selectedReport)
                        return `0 8px 25px ${alpha(main, 0.4)}`
                      })(),
                      transform: 'translateY(-2px) scale(1.02)'
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  Back to Reports
                </Button>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  {(() => {
                    const { Icon } = accentFor(selectedReport)
                    return (
                      <Box sx={{
                        p: 2,
                        borderRadius: 3,
                        background: (() => {
                          const { main, alt } = accentFor(selectedReport)
                          return `linear-gradient(135deg, ${main}, ${alt})`
                        })(),
                        boxShadow: (() => {
                          const { main } = accentFor(selectedReport)
                          return `0 8px 25px ${alpha(main, 0.3)}`
                        })(),
                        animation: 'float 3s ease-in-out infinite'
                      }}>
                        <Icon size={40} />
                      </Box>
                    )
                  })()}
                </Box>
                
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 900,
                    fontSize: { xs: 24, sm: 28, md: 36 },
                    background: (() => {
                      const { main, alt } = accentFor(selectedReport)
                      return `linear-gradient(135deg, ${main}, ${alt})`
                    })(),
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.5px',
                    textAlign: 'center',
                    mb: 1
                  }}
                >
                  {selectedReportLabel}
                </Typography>
                
                <Typography 
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    fontSize: { xs: 14, md: 16 },
                    fontWeight: 500,
                    maxWidth: 500,
                    mx: 'auto'
                  }}
                >
                  {(() => {
                    const reportData = reportGroups
                      .flatMap(group => group.reports)
                      .find(report => report.key === selectedReport)
                    return reportData?.description || 'Detailed analytics and insights'
                  })()}
                </Typography>
              </Box>
            </Paper>
          )}
          
          {/* Floating Back Button - Only show when report is generated */}
          {reportGenerated && (
            <Button 
              onClick={backToGrid} 
              variant="contained"
              startIcon={<ArrowBackIcon />}
              sx={{ 
                position: 'fixed',
                top: 16,
                left: 16,
                zIndex: 1000,
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: 14,
                px: 3,
                py: 1.25,
                background: (() => {
                  const { main, alt } = accentFor(selectedReport)
                  return `linear-gradient(135deg, ${main}, ${alt})`
                })(),
                boxShadow: (() => {
                  const { main } = accentFor(selectedReport)
                  return `0 6px 20px ${alpha(main, 0.4)}`
                })(),
                '&:hover': {
                  boxShadow: (() => {
                    const { main } = accentFor(selectedReport)
                    return `0 8px 25px ${alpha(main, 0.5)}`
                  })(),
                  transform: 'translateY(-2px) scale(1.02)'
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              Back to Reports
            </Button>
          )}
          
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
            <ReportRunner selectedReport={selectedReport} onReportGenerated={handleReportGenerated} />
          </Box>
        </Box>
      )}
    </Box>
  )
}
