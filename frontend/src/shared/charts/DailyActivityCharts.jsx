import { Box, Paper, Typography } from '@mui/material'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts'

const COLORS = ['#10b981', '#06b6d4', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#3b82f6', '#22c55e']

export default function DailyActivityCharts({ data }) {
  if (!data || !data.recordsets || data.recordsets.length < 3) {
    return null
  }

  const [businessActivities, attendanceData, expenseData] = data.recordsets

  // Process business activities data
  const processedActivities = businessActivities?.map(item => ({
    srno: item.SRNO,
    name: (item.PROCESSNAME || 'Unknown').length > 20 ? 
      (item.PROCESSNAME || 'Unknown').substring(0, 20) + '...' : 
      (item.PROCESSNAME || 'Unknown'),
    fullName: item.PROCESSNAME || 'Unknown',
    unit: item.UNIT || 0,
    grossValue: item.GROSSVALUE || 0,
    gstValue: item.GSTVALUE || 0,
    totalValue: item.TOTALVALUE || 0,
  })) || []

  // Process attendance data (filter out total row)
  const processedAttendance = attendanceData
    ?.filter(item => item.DATE_OF_ATTENDANCE !== null)
    .map(item => ({
      date: new Date(item.DATE_OF_ATTENDANCE).toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'short' 
      }),
      fullDate: item.DATE_OF_ATTENDANCE,
      attendance: item.ATTENDANCE || 0,
    })) || []

  // Process expense data (filter out total row)
  const processedExpenses = expenseData
    ?.filter(item => item.EXPANSE_DATE !== null)
    .map(item => ({
      date: new Date(item.EXPANSE_DATE).toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'short' 
      }),
      fullDate: item.EXPANSE_DATE,
      totalValue: item.TOTAL_VALUE || 0,
    })) || []

  // Get totals
  const totalAttendance = attendanceData?.find(item => item.DATE_OF_ATTENDANCE === null)?.ATTENDANCE || 0
  const totalExpenses = expenseData?.find(item => item.EXPANSE_DATE === null)?.TOTAL_VALUE || 0
  const totalBusinessValue = processedActivities.reduce((sum, item) => sum + item.totalValue, 0)
  const totalUnits = processedActivities.reduce((sum, item) => sum + item.unit, 0)

  return (
    <Box sx={{ m: 0 }}>
      {/* Summary Cards */}
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
          background: '#10b981',
          borderBottom: '2px solid #059669',
          mb: 0
        }}>
          Daily Activity Summary
        </Box>
        <Box sx={{ p: { xs: 2, md: 2.5 } }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr 1fr' }, gap: 2 }}>
            <Box>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mb: 0.5, fontSize: { xs: 11, md: 14 } }}>
                Total Business Value
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981', fontSize: { xs: 18, md: 24 } }}>
                ₹{totalBusinessValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mb: 0.5, fontSize: { xs: 11, md: 14 } }}>
                Total Units
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#06b6d4', fontSize: { xs: 18, md: 24 } }}>
                {totalUnits.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mb: 0.5, fontSize: { xs: 11, md: 14 } }}>
                Total Attendance
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#f59e0b', fontSize: { xs: 18, md: 24 } }}>
                {totalAttendance}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mb: 0.5, fontSize: { xs: 11, md: 14 } }}>
                Total Expenses
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#ef4444', fontSize: { xs: 18, md: 24 } }}>
                ₹{totalExpenses.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {/* Chart 1: Business Activities Value - Bar Chart */}
        <Box sx={{ width: '100%' }}>
          <Paper 
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
              background: '#10b981',
              borderBottom: '2px solid #059669',
              mb: 0
            }}>
              Business Activities Value
            </Box>
            <Box sx={{ width: '100%', overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch', p: { xs: 2, md: 2.5 } }}>
              <Box sx={{ minWidth: Math.max(1200, processedActivities.length * 100), height: { xs: 350, md: 400 } }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={processedActivities} margin={{ top: 10, right: 10, left: 10, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#64748b" 
                    tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} 
                    angle={-45}
                    textAnchor="end"
                    height={70}
                    interval={0}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    tick={{ fontSize: 14, fill: '#64748b', fontWeight: 600 }}
                    width={80}
                    label={{ value: 'Value (₹)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '16px', fontWeight: 'bold' } }}
                  />
                  <RechartsTooltip 
                    formatter={(value, name) => {
                      if (name === 'totalValue') return [`₹${value.toLocaleString('en-IN')}`, 'Total Value']
                      if (name === 'unit') return [value.toLocaleString('en-IN'), 'Units']
                      return [value, name]
                    }}
                    labelFormatter={(label, payload) => {
                      const data = payload?.[0]?.payload;
                      return `Activity: ${data?.fullName || label}`;
                    }}
                    contentStyle={{ 
                      background: 'rgba(255,255,255,0.98)', 
                      border: '2px solid #e2e8f0',
                      borderRadius: 12,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  />
                  <Bar dataKey="totalValue" fill="#10b981" radius={[8, 8, 0, 0]} stroke="#10b981" strokeWidth={2} />
                </BarChart>
              </ResponsiveContainer>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Chart 2: Daily Attendance Trend - Area Chart */}
        {processedAttendance.length > 0 && (
        <Box sx={{ width: '100%' }}>
          <Paper 
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
              Daily Attendance Trend
            </Box>
            <Box sx={{ width: '100%', overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch', p: { xs: 2, md: 2.5 } }}>
              <Box sx={{ minWidth: Math.max(1200, processedAttendance.length * 80), height: { xs: 350, md: 400 } }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={processedAttendance} margin={{ top: 10, right: 10, left: 10, bottom: 80 }}>
                  <defs>
                    <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b" 
                    tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} 
                    angle={-45}
                    textAnchor="end"
                    height={70}
                    interval={0}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    tick={{ fontSize: 14, fill: '#64748b', fontWeight: 600 }}
                    width={60}
                    label={{ value: 'Attendance', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '16px', fontWeight: 'bold' } }}
                  />
                  <RechartsTooltip 
                    formatter={(value) => [value, 'Attendance']}
                    labelFormatter={(label, payload) => {
                      const data = payload?.[0]?.payload;
                      return `Date: ${new Date(data?.fullDate).toLocaleDateString('en-IN')}`;
                    }}
                    contentStyle={{ 
                      background: 'rgba(255,255,255,0.98)', 
                      border: '2px solid #e2e8f0',
                      borderRadius: 12,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="attendance" 
                    stroke="#f59e0b" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#attendanceGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
              </Box>
            </Box>
          </Paper>
        </Box>
        )}

        {/* Chart 3: Daily Expenses Trend - Line Chart */}
        {processedExpenses.length > 0 && (
        <Box sx={{ width: '100%' }}>
          <Paper 
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
              Daily Expenses Trend
            </Box>
            <Box sx={{ width: '100%', overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch', p: { xs: 2, md: 2.5 } }}>
              <Box sx={{ minWidth: Math.max(1200, processedExpenses.length * 80), height: { xs: 350, md: 400 } }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={processedExpenses} margin={{ top: 10, right: 10, left: 10, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b" 
                    tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} 
                    angle={-45}
                    textAnchor="end"
                    height={70}
                    interval={0}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    tick={{ fontSize: 14, fill: '#64748b', fontWeight: 600 }}
                    width={80}
                    label={{ value: 'Amount (₹)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '16px', fontWeight: 'bold' } }}
                  />
                  <RechartsTooltip 
                    formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Expense Amount']}
                    labelFormatter={(label, payload) => {
                      const data = payload?.[0]?.payload;
                      return `Date: ${new Date(data?.fullDate).toLocaleDateString('en-IN')}`;
                    }}
                    contentStyle={{ 
                      background: 'rgba(255,255,255,0.98)', 
                      border: '2px solid #e2e8f0',
                      borderRadius: 12,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="totalValue" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    dot={{ fill: '#ef4444', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, stroke: '#ef4444', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              </Box>
            </Box>
          </Paper>
        </Box>
        )}

        {/* Chart 4: Activity Types Distribution - Pie Chart */}
        <Box sx={{ width: '100%' }}>
          <Paper 
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
              background: '#06b6d4',
              borderBottom: '2px solid #0891b2',
              mb: 0
            }}>
              Business Activities Distribution
            </Box>
            <Box sx={{ p: { xs: 2, md: 2.5 } }}>
            <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 450 : 700}>
              <PieChart>
                <Pie
                  data={processedActivities.filter(item => item.totalValue > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={{ stroke: '#64748b', strokeWidth: 0.5, length: window.innerWidth < 768 ? 10 : 20 }}
                  label={(props) => {
                    const { name, percent, x, y, cx } = props
                    if (percent > 0.03) {
                      const isMobile = window.innerWidth < 768
                      const fontSize = isMobile ? 8 : 14
                      
                      return (
                        <text 
                          x={x} 
                          y={y} 
                          fill="#1e293b" 
                          textAnchor={x > cx ? 'start' : 'end'} 
                          dominantBaseline="central"
                          style={{ fontSize: `${fontSize}px`, fontWeight: 600 }}
                        >
                          {`${name} ${(percent * 100).toFixed(1)}%`}
                        </text>
                      )
                    }
                    return null
                  }}
                  outerRadius={window.innerWidth < 768 ? 70 : 220}
                  innerRadius={window.innerWidth < 768 ? 30 : 80}
                  fill="#06b6d4"
                  dataKey="totalValue"
                  paddingAngle={1}
                >
                  {processedActivities.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      const total = processedActivities.reduce((sum, item) => sum + item.totalValue, 0)
                      const percent = total > 0 ? ((data.totalValue / total) * 100).toFixed(1) : 0
                      return (
                        <div style={{
                          background: 'linear-gradient(135deg, #ffffff 0%, #cffafe 100%)',
                          border: '3px solid #06b6d4',
                          borderRadius: '16px',
                          padding: '16px 20px',
                          boxShadow: '0 12px 32px rgba(6, 182, 212, 0.3)',
                          minWidth: '220px'
                        }}>
                          <div style={{
                            fontSize: '18px',
                            fontWeight: '800',
                            color: '#0e7490',
                            marginBottom: '8px',
                            borderBottom: '2px solid #06b6d4',
                            paddingBottom: '8px'
                          }}>
                            {data.fullName}
                          </div>
                          <div style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            color: '#0891b2',
                            marginBottom: '4px'
                          }}>
                            Value: ₹{data.totalValue.toLocaleString('en-IN')}
                          </div>
                          <div style={{
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#06b6d4'
                          }}>
                            Percentage: {percent}%
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}
