import { Box, Paper, Stack, Typography } from '@mui/material'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, Legend, LabelList } from 'recharts'

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
        <Typography sx={{ fontSize: '16px', fontWeight: 'bold', color: '#ef4444' }}>
          Pending: ₹{data.pendingPayment.toLocaleString()}
        </Typography>
      </Box>
    );
  }
  return null;
};

export default function PendingPaymentCharts({ data }) {
  if (!data || !data.recordsets || data.recordsets.length < 1) {
    return null
  }

  const [pendingPayments] = data.recordsets

  // Process data for charts
  const partyData = pendingPayments?.map(item => ({
    name: item.PARTY_NAME || 'Unknown',
    fullName: item.PARTY_NAME || 'Unknown',
    saleAmount: item.SALEAMOUNT || 0,
    paymentReceived: item.PAYMENTRECIEVED || 0,
    pendingPayment: item.PENDING_PAYMENT || 0,
    value: item.PENDING_PAYMENT || 0
  })) || []

  // Sort by pending payment (highest first) for better visualization
  const sortedPartyData = [...partyData]
    .sort((a, b) => b.pendingPayment - a.pendingPayment)

  // Calculate dynamic width for scrollable charts (80px per party for comfortable spacing)
  const chartWidth = Math.max(1200, sortedPartyData.length * 80)

  // Take top 10 for pie chart (pie charts work best with fewer categories to avoid label overlap)
  const topPartiesPieData = [...partyData]
    .sort((a, b) => b.pendingPayment - a.pendingPayment)
    .slice(0, 10)

  // Colors for charts
  const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981', '#06b6d4']

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Chart 1: Pending Payment by Party - Bar Chart */}
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
              background: '#ef4444',
              borderBottom: '2px solid #dc2626',
              mb: 0
            }}>
              Pending Payment by Party
            </Box>
            <Box sx={{ width: '100%', overflowX: 'auto', overflowY: 'hidden', p: { xs: 2, md: 2.5 } }}>
              <ResponsiveContainer width={chartWidth} height={550}>
                <BarChart data={sortedPartyData} margin={{ top: 10, right: 10, left: 10, bottom: 150 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#64748b" 
                    tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} 
                    angle={-45}
                    textAnchor="end"
                    height={130}
                    interval={0}
                  />
                <YAxis 
                  stroke="#64748b" 
                  tick={{ fontSize: 16, fill: '#64748b', fontWeight: 700 }}
                  width={80}
                  label={{ value: 'Pending Amount (₹)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '18px', fontWeight: 'bold' } }}
                />
                <RechartsTooltip 
                  formatter={(value, name) => [`₹${value.toLocaleString()}`, 'Pending Payment']}
                  labelFormatter={(label, payload) => {
                    const data = payload?.[0]?.payload;
                    return `Party: ${data?.fullName || label}`;
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
                <Bar dataKey="pendingPayment" fill="#ef4444" radius={[8, 8, 0, 0]} stroke="#ef4444" strokeWidth={2}>
                  <LabelList 
                    dataKey="pendingPayment" 
                    position="top" 
                    formatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                    style={{ fill: '#ef4444', fontWeight: 'bold', fontSize: 12 }} 
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>

        {/* Chart 2: Sales vs Payments - Line Chart */}
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
              background: '#f97316',
              borderBottom: '2px solid #ea580c',
              mb: 0
            }}>
              Sales Amount vs Payments Received 
            </Box>
            <Box sx={{ width: '100%', overflowX: 'auto', overflowY: 'hidden', p: { xs: 2, md: 2.5 } }}>
              <ResponsiveContainer width={chartWidth} height={550}>
                <LineChart data={sortedPartyData} margin={{ top: 10, right: 10, left: 10, bottom: 150 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#64748b" 
                    tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} 
                    angle={-45}
                    textAnchor="end"
                    height={130}
                    interval={0}
                  />
                <YAxis 
                  stroke="#64748b" 
                  tick={{ fontSize: 16, fill: '#64748b', fontWeight: 700 }}
                  width={80}
                  label={{ value: 'Amount (₹)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '18px', fontWeight: 'bold' } }}
                />
                <RechartsTooltip 
                  formatter={(value, name) => [`₹${value.toLocaleString()}`, name === 'saleAmount' ? 'Sales Amount' : 'Payments Received']}
                  labelFormatter={(label, payload) => {
                    const data = payload?.[0]?.payload;
                    return `Party: ${data?.fullName || label}`;
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
                  type="monotone" 
                  dataKey="saleAmount" 
                  stroke="#f97316" 
                  strokeWidth={4}
                  dot={{ fill: '#f97316', strokeWidth: 3, r: 6 }}
                  activeDot={{ r: 8, stroke: '#f97316', strokeWidth: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="paymentReceived" 
                  stroke="#f59e0b" 
                  strokeWidth={4}
                  dot={{ fill: '#f59e0b', strokeWidth: 3, r: 6 }}
                  activeDot={{ r: 8, stroke: '#f59e0b', strokeWidth: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>

        {/* Chart 3: Payment Status Distribution - Pie Chart */}
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
              background: '#f59e0b',
              borderBottom: '2px solid #d97706',
              mb: 0
            }}>
              Payment Status Distribution (Top 10 Parties)
            </Box>
            <Box sx={{ p: { xs: 2, md: 2.5 } }}>
            <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 600 : 700}>
              <PieChart>
                <Pie
                  data={topPartiesPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={{ stroke: '#64748b', strokeWidth: 0.5, length: window.innerWidth < 768 ? 15 : 20 }}
                  label={(props) => {
                    const { name, percent, x, y, cx } = props
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
                  }}
                  outerRadius={window.innerWidth < 768 ? 90 : 220}
                  innerRadius={window.innerWidth < 768 ? 40 : 80}
                  fill="#f59e0b"
                  dataKey="pendingPayment"
                  paddingAngle={1}
                >
                  {topPartiesPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      const total = topPartiesPieData.reduce((sum, item) => sum + item.pendingPayment, 0)
                      const percent = ((data.pendingPayment / total) * 100).toFixed(1)
                      return (
                        <div style={{
                          background: 'linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)',
                          border: '3px solid #ef4444',
                          borderRadius: '16px',
                          padding: '16px 20px',
                          boxShadow: '0 12px 32px rgba(239, 68, 68, 0.3)',
                          minWidth: '220px'
                        }}>
                          <div style={{
                            fontSize: '18px',
                            fontWeight: '800',
                            color: '#991b1b',
                            marginBottom: '8px',
                            borderBottom: '2px solid #ef4444',
                            paddingBottom: '8px'
                          }}>
                            {data.fullName}
                          </div>
                          <div style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            color: '#dc2626',
                            marginBottom: '4px'
                          }}>
                            Pending: ₹{data.pendingPayment.toLocaleString('en-IN')}
                          </div>
                          <div style={{
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#ef4444'
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
