import { Box, Paper, Stack, Typography } from '@mui/material'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid, LineChart, Line, AreaChart, Area } from 'recharts'

export default function PaymentReceivedCharts({ data }) {
  console.log('PaymentReceivedCharts Debug:', {
    hasData: !!data,
    hasRecordsets: !!data?.recordsets,
    recordsetsLength: data?.recordsets?.length,
    data: data
  })
  
  if (!data || !data.recordsets || data.recordsets.length < 2) {
    console.log('PaymentReceivedCharts: Returning null - insufficient data')
    return null
  }

  const [detailedPayments, partySummary] = data.recordsets
  
  console.log('PaymentReceivedCharts Data:', {
    detailedPaymentsLength: detailedPayments?.length,
    partySummaryLength: partySummary?.length
  })

  // Process data for charts
  const partyPaymentData = partySummary?.filter(item => item.PARTY_NAME !== 'GRAND TOTAL ').map(item => ({
    name: (item.PARTY_NAME || 'Unknown').length > 15 ? 
      (item.PARTY_NAME || 'Unknown').substring(0, 15) + '...' : 
      (item.PARTY_NAME || 'Unknown'),
    fullName: item.PARTY_NAME || 'Unknown',
    amount: item.AMOUNT || 0,
    value: item.AMOUNT || 0
  })) || []

  // Process detailed payments for trend chart (group by date)
  const paymentTrendData = detailedPayments && detailedPayments.length > 0 
    ? detailedPayments.reduce((acc, payment) => {
        const date = payment.PAYMENT_DATE ? new Date(payment.PAYMENT_DATE).toISOString().split('T')[0] : 'Unknown'
        const existing = acc.find(item => item.date === date)
        if (existing) {
          existing.amount += payment.AMOUNT || 0
          existing.count += 1
        } else {
          acc.push({
            date: date,
            amount: payment.AMOUNT || 0,
            count: 1
          })
        }
        return acc
      }, []).sort((a, b) => new Date(a.date) - new Date(b.date))
    : []

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Chart 1: Payment Amount by Party - Bar Chart */}
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
              background: '#10b981',
              borderBottom: '2px solid #059669',
              mb: 0
            }}>
              Payment Amount by Party
            </Box>
            <Box sx={{ width: '100%', overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch', p: { xs: 2, md: 2.5 } }}>
              <Box sx={{ minWidth: { xs: Math.max(600, partyPaymentData.length * 80), md: '100%' }, height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={partyPaymentData} margin={{ top: 10, right: 10, left: 10, bottom: 50 }}>
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
                  tick={{ fontSize: 14, fill: '#64748b', fontWeight: 600 }}
                  width={80}
                  label={{ value: 'Payment Amount (₹)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '16px', fontWeight: 'bold' } }}
                />
                <RechartsTooltip 
                  formatter={(value, name) => [`₹${value.toLocaleString()}`, 'Payment Amount']}
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
                <Bar dataKey="amount" fill="#10b981" radius={[8, 8, 0, 0]} stroke="#10b981" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Chart 2: Payment Trends - Area Chart */}
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
              Payment Trends Over Time
            </Box>
            <Box sx={{ width: '100%', overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch', p: { xs: 2, md: 2.5 } }}>
              <Box sx={{ minWidth: { xs: Math.max(600, paymentTrendData.length * 100), md: '100%' }, height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={paymentTrendData} margin={{ top: 10, right: 10, left: 10, bottom: 50 }}>
                <defs>
                  <linearGradient id="paymentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b" 
                  tick={{ fontSize: 14, fill: '#64748b', fontWeight: 600 }} 
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                />
                <YAxis 
                  stroke="#64748b" 
                  tick={{ fontSize: 14, fill: '#64748b', fontWeight: 600 }}
                  width={80}
                  label={{ value: 'Payment Amount (₹)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '16px', fontWeight: 'bold' } }}
                />
                <RechartsTooltip 
                  formatter={(value, name) => [`₹${value.toLocaleString()}`, 'Payment Amount']}
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
                  dataKey="amount" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#paymentGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}
