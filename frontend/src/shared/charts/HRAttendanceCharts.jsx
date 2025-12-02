import { Box, Paper, Typography } from '@mui/material'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

const COLORS = ['#f59e0b', '#22c55e', '#ef4444', '#06b6d4', '#8b5cf6', '#ec4899', '#3b82f6', '#10b981']

export default function HRAttendanceCharts({ data }) {
  if (!data || !data.recordsets || data.recordsets.length < 1) {
    return null
  }

  const [attendanceData] = data.recordsets

  // Process data - extract attendance info
  const processedData = attendanceData?.map(item => ({
    empCode: item.EMP_CODE || 'Unknown',
    empName: (item.EMP_NAME || 'Unknown').length > 15 ? 
      (item.EMP_NAME || 'Unknown').substring(0, 15) + '...' : 
      (item.EMP_NAME || 'Unknown'),
    fullName: item.EMP_NAME || 'Unknown',
    section: item.SECTION || 'Unknown',
    daysPresent: item.DAYS_PRESENT || 0,
    workHour: item.WORK_HOUR || 0,
    contractor: item.CONTRACTOR || 'Unknown',
    nationality: item.NATIONALITY || 'Unknown',
    gender: item.GENDER || 'Unknown',
    empStatus: item.EMP_STATUS || 'Unknown',
  })) || []

  // Sort by days present (highest first)
  const sortedByDays = [...processedData].sort((a, b) => b.daysPresent - a.daysPresent)

  // Group by section
  const sectionData = processedData.reduce((acc, item) => {
    const section = item.section
    if (!acc[section]) {
      acc[section] = {
        name: section.length > 15 ? section.substring(0, 15) + '...' : section,
        fullName: section,
        employees: 0,
        totalDays: 0,
        totalHours: 0
      }
    }
    acc[section].employees += 1
    acc[section].totalDays += item.daysPresent
    acc[section].totalHours += item.workHour
    return acc
  }, {})

  const sectionChartData = Object.values(sectionData).sort((a, b) => b.employees - a.employees)

  // Group by contractor
  const contractorData = processedData.reduce((acc, item) => {
    const contractor = item.contractor
    if (!acc[contractor]) {
      acc[contractor] = {
        name: contractor.length > 15 ? contractor.substring(0, 15) + '...' : contractor,
        fullName: contractor,
        employees: 0,
        totalDays: 0,
        totalHours: 0
      }
    }
    acc[contractor].employees += 1
    acc[contractor].totalDays += item.daysPresent
    acc[contractor].totalHours += item.workHour
    return acc
  }, {})

  const contractorChartData = Object.values(contractorData).sort((a, b) => b.employees - a.employees)

  // Group by nationality
  const nationalityData = processedData.reduce((acc, item) => {
    const nationality = item.nationality
    if (!acc[nationality]) {
      acc[nationality] = { name: nationality, value: 0 }
    }
    acc[nationality].value += 1
    return acc
  }, {})

  const nationalityChartData = Object.values(nationalityData).sort((a, b) => b.value - a.value)

  // Calculate totals
  const totalEmployees = processedData.length
  const totalDaysPresent = processedData.reduce((sum, item) => sum + item.daysPresent, 0)
  const totalWorkHours = processedData.reduce((sum, item) => sum + item.workHour, 0)
  const avgDaysPresent = totalEmployees > 0 ? (totalDaysPresent / totalEmployees).toFixed(1) : 0
  const avgWorkHours = totalEmployees > 0 ? (totalWorkHours / totalEmployees).toFixed(1) : 0

  // Calculate chart width
  const chartWidth = Math.max(1200, sortedByDays.length * 60)

  return (
    <Box sx={{ m: 0 }}>
      {/* Summary Card */}
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
          background: '#f59e0b',
          borderBottom: '2px solid #d97706',
          mb: 0
        }}>
          HR Attendance Summary
        </Box>
        <Box sx={{ p: { xs: 2, md: 2.5 } }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr', md: '1fr 1fr 1fr 1fr 1fr' }, gap: 2 }}>
            <Box>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mb: 0.5, fontSize: { xs: 11, md: 14 } }}>
                Total Employees
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#f59e0b', fontSize: { xs: 18, md: 24 } }}>
                {totalEmployees}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mb: 0.5, fontSize: { xs: 11, md: 14 } }}>
                Total Days
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#22c55e', fontSize: { xs: 18, md: 24 } }}>
                {totalDaysPresent.toFixed(0)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mb: 0.5, fontSize: { xs: 11, md: 14 } }}>
                Total Hours
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#06b6d4', fontSize: { xs: 18, md: 24 } }}>
                {totalWorkHours.toFixed(0)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mb: 0.5, fontSize: { xs: 11, md: 14 } }}>
                Avg Days/Emp
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#8b5cf6', fontSize: { xs: 18, md: 24 } }}>
                {avgDaysPresent}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mb: 0.5, fontSize: { xs: 11, md: 14 } }}>
                Avg Hours/Emp
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#ec4899', fontSize: { xs: 18, md: 24 } }}>
                {avgWorkHours}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {/* Chart 1: Attendance by Section - Bar Chart */}
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
              background: '#22c55e',
              borderBottom: '2px solid #16a34a',
              mb: 0
            }}>
              Employees by Section
            </Box>
            <Box sx={{ width: '100%', overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch', p: { xs: 2, md: 2.5 } }}>
              <Box sx={{ minWidth: Math.max(1200, sectionChartData.length * 100), height: { xs: 350, md: 400 } }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectionChartData} margin={{ top: 10, right: 10, left: 10, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                  <XAxis 
                    dataKey="name" 
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
                    label={{ value: 'Employees', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '16px', fontWeight: 'bold' } }}
                  />
                  <RechartsTooltip 
                    formatter={(value, name) => {
                      if (name === 'employees') return [value, 'Employees']
                      if (name === 'totalDays') return [value.toFixed(0), 'Total Days']
                      if (name === 'totalHours') return [value.toFixed(0), 'Total Hours']
                      return [value, name]
                    }}
                    labelFormatter={(label, payload) => {
                      const data = payload?.[0]?.payload;
                      return `Section: ${data?.fullName || label}`;
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
                  <Bar dataKey="employees" fill="#22c55e" radius={[8, 8, 0, 0]} stroke="#22c55e" strokeWidth={2} />
                </BarChart>
              </ResponsiveContainer>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Chart 2: Work Hours by Section - Line Chart */}
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
              Total Work Hours by Section
            </Box>
            <Box sx={{ width: '100%', overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch', p: { xs: 2, md: 2.5 } }}>
              <Box sx={{ minWidth: Math.max(1200, sectionChartData.length * 100), height: { xs: 350, md: 400 } }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sectionChartData} margin={{ top: 10, right: 10, left: 10, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                  <XAxis 
                    dataKey="name" 
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
                    label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '16px', fontWeight: 'bold' } }}
                  />
                  <RechartsTooltip 
                    formatter={(value) => [value.toFixed(0), 'Total Hours']}
                    labelFormatter={(label, payload) => {
                      const data = payload?.[0]?.payload;
                      return `Section: ${data?.fullName || label}`;
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
                    dataKey="totalHours" 
                    stroke="#06b6d4" 
                    strokeWidth={3}
                    dot={{ fill: '#06b6d4', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, stroke: '#06b6d4', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              </Box>
            </Box>
          </Paper>
        </Box>

{/* Chart 4: Days Present by Employee - Bar Chart */}
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
              Days Present by Employee
            </Box>
            <Box sx={{ width: '100%', overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch', p: { xs: 2, md: 2.5 } }}>
              <Box sx={{ minWidth: chartWidth, height: { xs: 350, md: 400 } }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedByDays} margin={{ top: 10, right: 10, left: 10, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                  <XAxis 
                    dataKey="empName" 
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
                    width={60}
                    label={{ value: 'Days Present', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '16px', fontWeight: 'bold' } }}
                  />
                  <RechartsTooltip 
                    formatter={(value, name) => {
                      if (name === 'daysPresent') return [value, 'Days Present']
                      if (name === 'workHour') return [value.toFixed(1), 'Work Hours']
                      return [value, name]
                    }}
                    labelFormatter={(label, payload) => {
                      const data = payload?.[0]?.payload;
                      return `Employee: ${data?.fullName || label}`;
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
                  <Bar dataKey="daysPresent" fill="#ef4444" radius={[8, 8, 0, 0]} stroke="#ef4444" strokeWidth={2} />
                </BarChart>
              </ResponsiveContainer>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}
