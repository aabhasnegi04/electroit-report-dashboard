import { Box, Paper, Stack, Typography } from '@mui/material'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid, LineChart, Line, AreaChart, Area } from 'recharts'

// Utility function to determine if data needs logarithmic scaling
const shouldUseLogScale = (data, dataKey, threshold = 10) => {
  if (!data || data.length === 0) return false
  
  const values = data.map(item => item[dataKey] || 0).filter(val => val > 0)
  if (values.length === 0) return false
  
  const maxValue = Math.max(...values)
  const minValue = Math.min(...values)
  
  // Use log scale if the ratio between max and min is greater than threshold
  return maxValue / minValue > threshold
}

// Custom tick formatter for logarithmic scale
const formatLogTick = (value) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
  return value.toString()
}

export default function PettyExpenseCharts({ data }) {
  if (!data || !data.recordsets || data.recordsets.length < 2) {
    return null
  }

  const [expenseData, summaryData] = data.recordsets

  // Process expense data for charts
  const expenseChartData = expenseData?.map((item, index) => {
    // Format date for display
    let dateLabel = 'Unknown'
    if (item.EXPANSE_DATE) {
      try {
        const date = new Date(item.EXPANSE_DATE)
        if (!isNaN(date.getTime())) {
          dateLabel = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
        }
      } catch (e) {
        // Keep default
      }
    }
    
    // Get expense type/category if available, otherwise use description or index
    const expenseType = item.EXPENSE_TYPE || item.CATEGORY || item.DESCRIPTION || `Expense ${index + 1}`
    const displayName = expenseType.length > 15 ? expenseType.substring(0, 15) + '...' : expenseType
    
    return {
      name: displayName,
      fullName: expenseType,
      date: dateLabel,
      fullDate: item.EXPANSE_DATE,
      totalValue: item.TOTAL_VALUE || 0,
      value: item.TOTAL_VALUE || 0,
      srno: item.SRNO || index + 1
    }
  }) || []

  // Sort by total value (highest first) for better visualization
  const sortedExpenseData = [...expenseChartData]
    .sort((a, b) => b.totalValue - a.totalValue)

  // Group by date for time series chart
  const dateGroupedData = expenseChartData.reduce((acc, item) => {
    const dateKey = item.fullDate || item.date
    if (!acc[dateKey]) {
      acc[dateKey] = { date: dateKey, dateLabel: item.date, total: 0, count: 0 }
    }
    acc[dateKey].total += item.totalValue
    acc[dateKey].count += 1
    return acc
  }, {})

  const dailyExpenseData = Object.values(dateGroupedData)
    .sort((a, b) => {
      // Sort by date if available
      if (a.date && b.date) {
        return new Date(a.date) - new Date(b.date)
      }
      return 0
    })
    .map(item => ({
      name: item.dateLabel || item.date,
      fullDate: item.date,
      total: item.total,
      count: item.count
    }))

  // Calculate dynamic width for scrollable charts (80px per expense)
  const chartWidth = Math.max(1200, expenseChartData.length * 80)

  // Get total from summary
  const totalExpense = summaryData?.[0]?.TOTAL_VALUE || 0

  // Determine scaling
  const useLogScaleExpenses = shouldUseLogScale(sortedExpenseData, 'totalValue', 5)
  const useLogScaleDaily = shouldUseLogScale(dailyExpenseData, 'total', 5)

  return (
    <Box sx={{ m: 0 }}>
      {/* Summary Card */}
      {totalExpense > 0 && (
        <Paper 
          elevation={0}
          sx={{ 
            p: 0, 
            borderRadius: 0, 
            background: (theme) => theme.palette.background.paper,
            border: 'none',
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            boxShadow: 'none',
            mb: 0
          }}>
          <Box sx={{ 
            p: { xs: 1.5, md: 2 }, 
            fontWeight: 700, 
            fontSize: { xs: 16, md: 18 },
            color: 'white',
            textAlign: 'center',
            background: '#8b5cf6',
            borderBottom: '2px solid #7c3aed',
            mb: 0
          }}>
            Total Petty Expenses Summary
          </Box>
          <Box sx={{ p: { xs: 2, md: 2.5 } }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
              <Box>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mb: 0.5, fontSize: { xs: 12, md: 14 } }}>
                  Total Amount
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#f59e0b', fontSize: { xs: 24, md: 32 } }}>
                  ₹{totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </Box>
              <Box sx={{ 
                width: { xs: 50, md: 60 }, 
                height: { xs: 50, md: 60 }, 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
              }}>
                <Typography sx={{ color: 'white', fontWeight: 700, fontSize: { xs: '20px', md: '24px' } }}>₹</Typography>
              </Box>
            </Stack>
          </Box>
        </Paper>
      )}

      {/* Vertical Stack Layout - Each Chart Full Width */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {/* Chart 1: Expenses by Item - Bar Chart */}
        <Box sx={{ width: '100%' }}>
          <Paper 
            id="expense-items-chart"
            elevation={0}
            sx={{ 
              p: 0, 
              borderRadius: 0, 
              background: (theme) => theme.palette.background.paper,
              border: 'none',
              borderTop: (theme) => `1px solid ${theme.palette.divider}`,
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              boxShadow: 'none'
            }}>
            <Box sx={{ 
              p: { xs: 1.5, md: 2 }, 
              fontWeight: 700, 
              fontSize: { xs: 16, md: 18 },
              color: 'white',
              textAlign: 'center',
              background: '#f59e0b',
              borderBottom: '2px solid #d97706',
              mb: 0
            }}>
              Expenses by Item (All Expenses)
            </Box>
            <Box sx={{ width: '100%', overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch', p: { xs: 2, md: 2.5 } }}>
              <Box sx={{ minWidth: Math.max(1200, sortedExpenseData.length * 80), height: { xs: 350, md: 400 } }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedExpenseData} margin={{ top: 10, right: 10, left: 10, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#64748b" 
                    tick={{ fontSize: 14, fill: '#64748b', fontWeight: 600 }} 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    tick={{ fontSize: 14, fill: '#64748b', fontWeight: 600 }}
                    label={{ value: 'Amount (₹)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '16px', fontWeight: 'bold' } }}
                    scale={useLogScaleExpenses ? 'log' : 'linear'}
                    domain={useLogScaleExpenses ? ['dataMin', 'dataMax'] : [0, 'dataMax']}
                    tickFormatter={useLogScaleExpenses ? formatLogTick : undefined}
                  />
                  <RechartsTooltip 
                    formatter={(value, name) => [`₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Amount']}
                    labelFormatter={(label, payload) => {
                      const data = payload?.[0]?.payload;
                      return `Item: ${data?.fullName || label}${data?.date ? ` | Date: ${data.date}` : ''}`;
                    }}
                    contentStyle={{ 
                      background: 'rgba(255,255,255,0.98)', 
                      border: '2px solid #e2e8f0',
                      borderRadius: 12,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}
                  />
                  <Bar dataKey="totalValue" fill="#f59e0b" radius={[8, 8, 0, 0]} stroke="#f59e0b" strokeWidth={2} />
                </BarChart>
              </ResponsiveContainer>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Chart 2: Daily Expense Trend - Area Chart */}
        {dailyExpenseData.length > 0 && (
          <Box sx={{ width: '100%' }}>
            <Paper 
              id="daily-expense-chart"
              elevation={0}
              sx={{ 
                p: 0, 
                borderRadius: 0, 
                background: (theme) => theme.palette.background.paper,
                border: 'none',
                borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                boxShadow: 'none'
              }}>
              <Box sx={{ 
                p: { xs: 1.5, md: 2 }, 
                fontWeight: 700, 
                fontSize: { xs: 16, md: 18 },
                color: 'white',
                textAlign: 'center',
                background: '#ef4444',
                borderBottom: '2px solid #dc2626',
                mb: 0
              }}>
                Daily Expense Trend
              </Box>
              <Box sx={{ width: '100%', overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch', p: { xs: 2, md: 2.5 } }}>
                <Box sx={{ minWidth: Math.max(1200, dailyExpenseData.length * 100), height: { xs: 350, md: 400 } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyExpenseData} margin={{ top: 10, right: 10, left: 10, bottom: 80 }}>
                    <defs>
                      <linearGradient id="dailyExpenseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#64748b" 
                      tick={{ fontSize: 14, fill: '#64748b', fontWeight: 600 }} 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                    />
                    <YAxis 
                      stroke="#64748b" 
                      tick={{ fontSize: 16, fill: '#64748b', fontWeight: 700 }}
                      label={{ value: 'Amount (₹)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '18px', fontWeight: 'bold' } }}
                      scale={useLogScaleDaily ? 'log' : 'linear'}
                      domain={useLogScaleDaily ? ['dataMin', 'dataMax'] : [0, 'dataMax']}
                      tickFormatter={useLogScaleDaily ? formatLogTick : undefined}
                    />
                    <RechartsTooltip 
                      formatter={(value, name) => {
                        if (name === 'count') {
                          return [value, 'Number of Expenses']
                        }
                        return [`₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Total Amount']
                      }}
                      labelFormatter={(label) => `Date: ${label}`}
                      contentStyle={{ 
                        background: 'rgba(255,255,255,0.98)', 
                        border: '2px solid #e2e8f0',
                        borderRadius: 12,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                        fontSize: '16px',
                        fontWeight: 'bold'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="total" 
                      stroke="#ef4444" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#dailyExpenseGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
                </Box>
              </Box>
            </Paper>
          </Box>
        )}

        {/* Chart 3: Expense Timeline - Line Chart */}
        {dailyExpenseData.length > 0 && (
          <Box sx={{ width: '100%' }}>
            <Paper 
              id="expense-timeline-chart"
              elevation={0}
              sx={{ 
                p: 0, 
                borderRadius: 0, 
                background: (theme) => theme.palette.background.paper,
                border: 'none',
                borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                boxShadow: 'none'
              }}>
              <Box sx={{ 
                p: { xs: 1.5, md: 2 }, 
                fontWeight: 700, 
                fontSize: { xs: 16, md: 18 },
                color: 'white',
                textAlign: 'center',
                background: '#22c55e',
                borderBottom: '2px solid #16a34a',
                mb: 0
              }}>
                Expense Timeline
              </Box>
              <Box sx={{ width: '100%', overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch', p: { xs: 2, md: 2.5 } }}>
                <Box sx={{ minWidth: Math.max(1200, dailyExpenseData.length * 100), height: { xs: 350, md: 400 } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyExpenseData} margin={{ top: 10, right: 10, left: 10, bottom: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#64748b" 
                      tick={{ fontSize: 14, fill: '#64748b', fontWeight: 600 }} 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                    />
                    <YAxis 
                      stroke="#64748b" 
                      tick={{ fontSize: 16, fill: '#64748b', fontWeight: 700 }}
                      label={{ value: 'Amount (₹)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '18px', fontWeight: 'bold' } }}
                    />
                    <RechartsTooltip 
                      formatter={(value, name) => {
                        if (name === 'count') {
                          return [value, 'Number of Expenses']
                        }
                        return [`₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Total Amount']
                      }}
                      labelFormatter={(label) => `Date: ${label}`}
                      contentStyle={{ 
                        background: 'rgba(255,255,255,0.98)', 
                        border: '2px solid #e2e8f0',
                        borderRadius: 12,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                        fontSize: '16px',
                        fontWeight: 'bold'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke="#22c55e" 
                      strokeWidth={5}
                      dot={{ fill: '#22c55e', strokeWidth: 3, r: 8 }}
                      activeDot={{ r: 10, stroke: '#22c55e', strokeWidth: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                </Box>
              </Box>
            </Paper>
          </Box>
        )}
      </Box>
    </Box>
  )
}

