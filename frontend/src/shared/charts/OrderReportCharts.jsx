import { Box, Paper, Stack, Typography } from '@mui/material'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts'

// Custom Tooltip for Pie Chart
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Box
        sx={{
          background: 'rgba(255,255,255,0.98)',
          border: '2px solid #e2e8f0',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          padding: '12px 16px',
        }}
      >
        <Typography sx={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', mb: 0.5 }}>
          {data.fullName}
        </Typography>
        <Typography sx={{ fontSize: '16px', fontWeight: 'bold', color: '#3b82f6' }}>
          Units: {data.units?.toLocaleString() || 0}
        </Typography>
        <Typography sx={{ fontSize: '16px', fontWeight: 'bold', color: '#10b981' }}>
          Total: ₹{data.totalValue?.toLocaleString() || 0}
        </Typography>
      </Box>
    );
  }
  return null;
};

export default function OrderReportCharts({ data }) {
  if (!data || !data.recordsets || data.recordsets.length < 3) {
    return null
  }

  const [monthData, clientData, brandData] = data.recordsets

  // Process month data
  const processedMonthData = monthData?.map(item => ({
    name: item.ORDERMONTH || 'Unknown',
    fullName: item.ORDERMONTH || 'Unknown',
    units: item.ORDERUNIT || 0,
    grossAmount: item.GROSS_AMOUNT || 0,
    totalGst: item.TOTALGST || 0,
    totalValue: item.TOTAL_VALUE || 0,
  })) || []

  // Sort and process client data
  const sortedClientData = [...(clientData || [])]
    .sort((a, b) => (b.TOTAL_VALUE || 0) - (a.TOTAL_VALUE || 0))
  
  const processedClientData = sortedClientData.map(item => ({
    name: (item.CLIENT_NAME || 'Unknown').length > 12 ? 
      (item.CLIENT_NAME || 'Unknown').substring(0, 12) + '...' : 
      (item.CLIENT_NAME || 'Unknown'),
    fullName: item.CLIENT_NAME || 'Unknown',
    units: item.ORDERUNIT || 0,
    grossAmount: item.GROSS_AMOUNT || 0,
    totalGst: item.TOTALGST || 0,
    totalValue: item.TOTAL_VALUE || 0,
  }))

  // Calculate dynamic width for scrollable client chart (80px per client)
  const clientChartWidth = Math.max(1200, processedClientData.length * 80)

  // Top 10 clients for pie chart
  const topClientsForPie = processedClientData.slice(0, 10)

  // Process brand data
  const processedBrandData = brandData?.map(item => ({
    name: item.BRAND || 'Unknown',
    fullName: item.BRAND || 'Unknown',
    units: item.ORDERUNIT || 0,
    grossAmount: item.GROSS_AMOUNT || 0,
    totalGst: item.TOTALGST || 0,
    totalValue: item.TOTAL_VALUE || 0,
    value: item.TOTAL_VALUE || 0
  })) || []

  // Colors for charts
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#6366f1']

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Chart 1: Orders by Month - Bar Chart */}
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
            }}
          >
            <Box sx={{ 
              p: { xs: 1.5, md: 2 }, 
              fontWeight: 700, 
              fontSize: { xs: 16, md: 18 },
              color: 'white',
              textAlign: 'center',
              background: '#3b82f6',
              borderBottom: '2px solid #2563eb',
              mb: 0
            }}>
              Orders by Month
            </Box>
            <Box sx={{ width: '100%', overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch', p: { xs: 2, md: 2.5 } }}>
              <Box sx={{ minWidth: { xs: Math.max(600, processedMonthData.length * 100), md: '100%' }, height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={processedMonthData} margin={{ top: 10, right: 10, left: 10, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  tick={{ fontSize: 14, fill: '#64748b', fontWeight: 600 }} 
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                />
                <YAxis 
                  stroke="#64748b" 
                  tick={{ fontSize: 16, fill: '#64748b', fontWeight: 700 }}
                  width={80}
                  label={{ value: 'Order Units', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '18px', fontWeight: 'bold' } }}
                />
                <RechartsTooltip 
                  formatter={(value, name) => {
                    if (name === 'units') return [value.toLocaleString(), 'Units']
                    if (name === 'totalValue') return [`₹${value.toLocaleString()}`, 'Total Value']
                    return [value, name]
                  }}
                  labelFormatter={(label) => `Month: ${label}`}
                  contentStyle={{ 
                    background: 'rgba(255,255,255,0.98)', 
                    border: '2px solid #e2e8f0',
                    borderRadius: 12,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                />
                <Bar dataKey="units" fill="#3b82f6" radius={[8, 8, 0, 0]} stroke="#3b82f6" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Chart 2: Orders by Client - Bar Chart with Scroll */}
        <Box sx={{ width: '100%' }}>
          <Paper
            elevation={0}
            sx={{
              p: 0,
              borderRadius: 0,
              background: (theme) => theme.palette.background.paper,
              border: 'none', borderTop: (theme) => `1px solid ${theme.palette.divider}`, borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              boxShadow: 'none'
            }}
          >
            <Box sx={{ 
              p: { xs: 1.5, md: 2 }, 
              fontWeight: 700, 
              fontSize: { xs: 16, md: 18 },
              color: 'white',
              textAlign: 'center',
              background: '#10b981',
              borderBottom: '2px solid #059669',
              mb: 2
            }}>
              Total Order Value by Client
            </Box>
            <Box sx={{ width: '100%', overflowX: 'auto', overflowY: 'hidden' }}>
              <ResponsiveContainer width={clientChartWidth} height={400}>
                <BarChart data={processedClientData} margin={{ top: 20, right: 50, left: 50, bottom: 60 }}>
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
                    label={{ value: 'Total Value (₹)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '18px', fontWeight: 'bold' } }}
                  />
                  <RechartsTooltip 
                    formatter={(value, name) => {
                      if (name === 'units') return [value.toLocaleString(), 'Units']
                      if (name === 'totalValue') return [`₹${value.toLocaleString()}`, 'Total Value']
                      return [value, name]
                    }}
                    labelFormatter={(label, payload) => {
                      const data = payload?.[0]?.payload;
                      return `Client: ${data?.fullName || label}`;
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
                  <Bar dataKey="totalValue" fill="#10b981" radius={[8, 8, 0, 0]} stroke="#10b981" strokeWidth={2} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>

        {/* Chart 3: Order Units vs Total Value by Client - Line Chart */}
        <Box sx={{ width: '100%' }}>
          <Paper
            elevation={0}
            sx={{
              p: 0,
              borderRadius: 0,
              background: (theme) => theme.palette.background.paper,
              border: 'none', borderTop: (theme) => `1px solid ${theme.palette.divider}`, borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              boxShadow: 'none'
            }}
          >
            <Box sx={{ 
              p: { xs: 1.5, md: 2 }, 
              fontWeight: 700, 
              fontSize: { xs: 16, md: 18 },
              color: 'white',
              textAlign: 'center',
              background: '#f59e0b',
              borderBottom: '2px solid #d97706',
              mb: 2
            }}>
              Units vs Total Value by Client
            </Box>
            <Box sx={{ width: '100%', overflowX: 'auto', overflowY: 'hidden' }}>
              <ResponsiveContainer width={clientChartWidth} height={400}>
                <LineChart data={processedClientData} margin={{ top: 20, right: 50, left: 50, bottom: 60 }}>
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
                    yAxisId="left"
                    stroke="#64748b" 
                    tick={{ fontSize: 16, fill: '#64748b', fontWeight: 700 }}
                    label={{ value: 'Units', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '18px', fontWeight: 'bold' } }}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="#64748b" 
                    tick={{ fontSize: 16, fill: '#64748b', fontWeight: 700 }}
                    label={{ value: 'Total Value (₹)', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fontSize: '18px', fontWeight: 'bold' } }}
                  />
                  <RechartsTooltip 
                    formatter={(value, name) => {
                      if (name === 'units') return [value.toLocaleString(), 'Units']
                      if (name === 'totalValue') return [`₹${value.toLocaleString()}`, 'Total Value']
                      return [value, name]
                    }}
                    labelFormatter={(label, payload) => {
                      const data = payload?.[0]?.payload;
                      return `Client: ${data?.fullName || label}`;
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
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="units" 
                    stroke="#f59e0b" 
                    strokeWidth={4}
                    dot={{ fill: '#f59e0b', strokeWidth: 3, r: 6 }}
                    activeDot={{ r: 8, stroke: '#f59e0b', strokeWidth: 3 }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="totalValue" 
                    stroke="#ef4444" 
                    strokeWidth={4}
                    dot={{ fill: '#ef4444', strokeWidth: 3, r: 6 }}
                    activeDot={{ r: 8, stroke: '#ef4444', strokeWidth: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>

        {/* Chart 4: Client Distribution - Pie Chart */}
        <Box sx={{ width: '100%' }}>
          <Paper
            elevation={0}
            sx={{
              p: 0,
              borderRadius: 0,
              background: (theme) => theme.palette.background.paper,
              border: 'none', borderTop: (theme) => `1px solid ${theme.palette.divider}`, borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              boxShadow: 'none'
            }}
          >
            <Box sx={{ 
              p: { xs: 1.5, md: 2 }, 
              fontWeight: 700, 
              fontSize: { xs: 16, md: 18 },
              color: 'white',
              textAlign: 'center',
              background: '#8b5cf6',
              borderBottom: '2px solid #7c3aed',
              mb: 2
            }}>
              Top 10 Clients by Order Value
            </Box>
            <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 500 : 800}>
              <PieChart>
                <Pie
                  data={topClientsForPie}
                  cx="50%"
                  cy="50%"
                  labelLine={{ stroke: '#64748b', strokeWidth: 0.5, length: window.innerWidth < 768 ? 10 : 20 }}
                  label={(props) => {
                    const { name, percent, x, y, cx } = props
                    // Only show label if percentage is greater than 3%
                    if (percent > 0.03) {
                      const isMobile = window.innerWidth < 768
                      const maxLength = isMobile ? 6 : 10
                      const displayName = name.length > maxLength ? name.substring(0, maxLength) + '...' : name
                      const fontSize = isMobile ? 9 : 14
                      
                      return (
                        <text 
                          x={x} 
                          y={y} 
                          fill="#1e293b" 
                          textAnchor={x > cx ? 'start' : 'end'} 
                          dominantBaseline="central"
                          style={{ fontSize: `${fontSize}px`, fontWeight: 600 }}
                        >
                          {`${displayName} ${(percent * 100).toFixed(1)}%`}
                        </text>
                      )
                    }
                    return null
                  }}
                  outerRadius={window.innerWidth < 768 ? 80 : 260}
                  innerRadius={window.innerWidth < 768 ? 30 : 90}
                  fill="#8b5cf6"
                  dataKey="totalValue"
                  paddingAngle={1}
                >
                  {topClientsForPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      const total = topClientsForPie.reduce((sum, item) => sum + item.totalValue, 0)
                      const percent = ((data.totalValue / total) * 100).toFixed(1)
                      return (
                        <div style={{
                          background: (theme) => theme.palette.background.paper,
                          border: '3px solid #8b5cf6',
                          borderRadius: '16px',
                          padding: '16px 20px',
                          boxShadow: '0 12px 32px rgba(139, 92, 246, 0.3)',
                          minWidth: '220px'
                        }}>
                          <div style={{
                            fontSize: '18px',
                            fontWeight: '800',
                            color: '#6b21a8',
                            marginBottom: '8px',
                            borderBottom: '2px solid #8b5cf6',
                            paddingBottom: '8px'
                          }}>
                            {data.fullName}
                          </div>
                          <div style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            color: '#7c3aed',
                            marginBottom: '4px'
                          }}>
                            Order Value: ₹{data.totalValue.toLocaleString('en-IN')}
                          </div>
                          <div style={{
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#8b5cf6',
                            marginBottom: '4px'
                          }}>
                            Units: {data.units.toLocaleString('en-IN')}
                          </div>
                          <div style={{
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#a78bfa'
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
          </Paper>
        </Box>

        {/* Chart 5: Orders by Brand - Bar Chart */}
        <Box sx={{ width: '100%' }}>
          <Paper
            elevation={0}
            sx={{
              p: 0,
              borderRadius: 0,
              background: (theme) => theme.palette.background.paper,
              border: 'none', borderTop: (theme) => `1px solid ${theme.palette.divider}`, borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              boxShadow: 'none'
            }}
          >
            <Box sx={{ 
              p: { xs: 1.5, md: 2 }, 
              fontWeight: 700, 
              fontSize: { xs: 16, md: 18 },
              color: 'white',
              textAlign: 'center',
              background: '#ec4899',
              borderBottom: '2px solid #db2777',
              mb: 2
            }}>
              Orders by Brand
            </Box>
            <Box sx={{ width: '100%', overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch' }}>
              <Box sx={{ minWidth: { xs: Math.max(600, processedBrandData.length * 80), md: '100%' }, height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={processedBrandData} margin={{ top: 10, right: 10, left: 10, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  tick={{ fontSize: 14, fill: '#64748b', fontWeight: 600 }} 
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                />
                <YAxis 
                  stroke="#64748b" 
                  tick={{ fontSize: 16, fill: '#64748b', fontWeight: 700 }}
                  width={80}
                  label={{ value: 'Order Units', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '18px', fontWeight: 'bold' } }}
                />
                <RechartsTooltip 
                  formatter={(value, name) => {
                    if (name === 'units') return [value.toLocaleString(), 'Units']
                    if (name === 'totalValue') return [`₹${value.toLocaleString()}`, 'Total Value']
                    return [value, name]
                  }}
                  labelFormatter={(label) => `Brand: ${label}`}
                  contentStyle={{ 
                    background: 'rgba(255,255,255,0.98)', 
                    border: '2px solid #e2e8f0',
                    borderRadius: 12,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                />
                <Bar dataKey="units" fill="#ec4899" radius={[8, 8, 0, 0]} stroke="#ec4899" strokeWidth={2} />
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


