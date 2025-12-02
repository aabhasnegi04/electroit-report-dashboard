import { Box, Paper, Typography } from '@mui/material'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

const COLORS = ['#ec4899', '#8b5cf6', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#10b981']

export default function SundryCreditorsCharts({ data }) {
  if (!data || !data.recordsets || data.recordsets.length < 1) {
    return null
  }

  const [creditorsData] = data.recordsets

  // Filter out GRAND TOTAL row and process data
  const processedData = creditorsData
    ?.filter(item => item.SELLER_NAME !== 'GRAND TOTAL :')
    .map(item => ({
      name: (item.SELLER_NAME || 'Unknown').length > 15 ? 
        (item.SELLER_NAME || 'Unknown').substring(0, 15) + '...' : 
        (item.SELLER_NAME || 'Unknown'),
      fullName: item.SELLER_NAME || 'Unknown',
      purchaseTotal: item.PURCHASE_TOTAL || 0,
      returnTotal: item.RETURN_TOTAL || 0,
      debit: item.DEBIT || 0,
      credit: item.CREDIT || 0,
      closingBalance: item.CLOSING_BALANCE || 0,
    })) || []

  // Sort by closing balance (highest first)
  const sortedByBalance = [...processedData].sort((a, b) => b.closingBalance - a.closingBalance)

  // Top 10 for pie chart
  const topCreditorsForPie = sortedByBalance.slice(0, 10)

  // Calculate chart width
  const chartWidth = Math.max(1200, processedData.length * 80)

  // Get grand total
  const grandTotal = creditorsData?.find(item => item.SELLER_NAME === 'GRAND TOTAL :')

  return (
    <Box sx={{ m: 0 }}>
      {/* Summary Card */}
      {grandTotal && (
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
            background: '#ec4899',
            borderBottom: '2px solid #db2777',
            mb: 0
          }}>
            Sundry Creditors Summary
          </Box>
          <Box sx={{ p: { xs: 2, md: 2.5 } }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mb: 0.5, fontSize: { xs: 12, md: 14 } }}>
                  Total Purchase
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#8b5cf6', fontSize: { xs: 20, md: 24 } }}>
                  ₹{(grandTotal.PURCHASE_TOTAL || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mb: 0.5, fontSize: { xs: 12, md: 14 } }}>
                  Total Payment
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#22c55e', fontSize: { xs: 20, md: 24 } }}>
                  ₹{(grandTotal.CREDIT || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mb: 0.5, fontSize: { xs: 12, md: 14 } }}>
                  Closing Balance
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#ec4899', fontSize: { xs: 20, md: 24 } }}>
                  ₹{(grandTotal.CLOSING_BALANCE || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {/* Chart 1: Closing Balance by Creditor - Bar Chart */}
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
              background: '#ec4899',
              borderBottom: '2px solid #db2777',
              mb: 0
            }}>
              Closing Balance by Creditor
            </Box>
            <Box sx={{ width: '100%', overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch', p: { xs: 2, md: 2.5 } }}>
              <Box sx={{ minWidth: chartWidth, height: { xs: 350, md: 400 } }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedByBalance} margin={{ top: 10, right: 10, left: 10, bottom: 80 }}>
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
                    width={80}
                    label={{ value: 'Closing Balance (₹)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '16px', fontWeight: 'bold' } }}
                  />
                  <RechartsTooltip 
                    formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Closing Balance']}
                    labelFormatter={(label, payload) => {
                      const data = payload?.[0]?.payload;
                      return `Creditor: ${data?.fullName || label}`;
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
                  <Bar dataKey="closingBalance" fill="#ec4899" radius={[8, 8, 0, 0]} stroke="#ec4899" strokeWidth={2} />
                </BarChart>
              </ResponsiveContainer>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Chart 2: Purchase vs Payment - Line Chart */}
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
              background: '#8b5cf6',
              borderBottom: '2px solid #7c3aed',
              mb: 0
            }}>
              Purchase vs Payment by Creditor
            </Box>
            <Box sx={{ width: '100%', overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch', p: { xs: 2, md: 2.5 } }}>
              <Box sx={{ minWidth: chartWidth, height: { xs: 350, md: 400 } }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sortedByBalance} margin={{ top: 10, right: 10, left: 10, bottom: 80 }}>
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
                    width={80}
                    label={{ value: 'Amount (₹)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '16px', fontWeight: 'bold' } }}
                  />
                  <RechartsTooltip 
                    formatter={(value, name) => [`₹${value.toLocaleString('en-IN')}`, name === 'debit' ? 'Purchase (Debit)' : 'Payment (Credit)']}
                    labelFormatter={(label, payload) => {
                      const data = payload?.[0]?.payload;
                      return `Creditor: ${data?.fullName || label}`;
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
                    dataKey="debit" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, stroke: '#8b5cf6', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="credit" 
                    stroke="#22c55e" 
                    strokeWidth={3}
                    dot={{ fill: '#22c55e', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, stroke: '#22c55e', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Chart 3: Top 10 Creditors by Balance - Pie Chart */}
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
              Top 10 Creditors by Closing Balance
            </Box>
            <Box sx={{ p: { xs: 2, md: 2.5 } }}>
            <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 450 : 700}>
              <PieChart>
                <Pie
                  data={topCreditorsForPie}
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
                  fill="#ec4899"
                  dataKey="closingBalance"
                  paddingAngle={1}
                >
                  {topCreditorsForPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      const total = topCreditorsForPie.reduce((sum, item) => sum + item.closingBalance, 0)
                      const percent = ((data.closingBalance / total) * 100).toFixed(1)
                      return (
                        <div style={{
                          background: 'linear-gradient(135deg, #ffffff 0%, #fce7f3 100%)',
                          border: '3px solid #ec4899',
                          borderRadius: '16px',
                          padding: '16px 20px',
                          boxShadow: '0 12px 32px rgba(236, 72, 153, 0.3)',
                          minWidth: '220px'
                        }}>
                          <div style={{
                            fontSize: '18px',
                            fontWeight: '800',
                            color: '#9f1239',
                            marginBottom: '8px',
                            borderBottom: '2px solid #ec4899',
                            paddingBottom: '8px'
                          }}>
                            {data.fullName}
                          </div>
                          <div style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            color: '#db2777',
                            marginBottom: '4px'
                          }}>
                            Balance: ₹{data.closingBalance.toLocaleString('en-IN')}
                          </div>
                          <div style={{
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#ec4899'
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
