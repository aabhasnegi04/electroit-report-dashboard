import { Box, Paper, Typography } from '@mui/material'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, LabelList } from 'recharts'

const COLORS = ['#f97316', '#06b6d4', '#10b981', '#8b5cf6', '#ef4444', '#ec4899', '#6366f1', '#22c55e']

export default function CollectionByBrandCharts({ data }) {
  if (!data || !data.recordsets || data.recordsets.length < 3) {
    return null
  }

  const [detailedData, summaryData, detailedByModeData] = data.recordsets

  // Process summary data for charts (excluding grand total)
  const processedSummaryData = summaryData
    ?.filter(item => item.COLLECTIONBY && item.COLLECTIONBY.toLowerCase() !== 'grand total')
    .map(item => ({
      name: (item.COLLECTIONBY || 'Unknown').length > 15 ? 
        (item.COLLECTIONBY || 'Unknown').substring(0, 15) + '...' : 
        (item.COLLECTIONBY || 'Unknown'),
      fullName: item.COLLECTIONBY || 'Unknown',
      invoiceCount: Number(item.INVOICECOUNT) || 0,
      amount: Number(item.AMOUNT) || 0,
    })) || []

  // Sort by amount (highest first)
  const sortedByAmount = [...processedSummaryData].sort((a, b) => b.amount - a.amount)

  // Process payment mode data for pie chart
  const paymentModeData = (() => {
    const modeMap = new Map()
    
    detailedByModeData
      ?.filter(item => item.COLLECTIONBY && item.COLLECTIONBY.toLowerCase() !== 'grand total')
      .forEach(item => {
        const mode = item.PAYMENT_MODE || 'Unknown'
        const existing = modeMap.get(mode) || { mode, amount: 0, invoiceCount: 0 }
        existing.amount += Number(item.AMOUNT) || 0
        existing.invoiceCount += Number(item.INVOICECOUNT) || 0
        modeMap.set(mode, existing)
      })
    
    return Array.from(modeMap.values())
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10) // Top 10 for pie chart
  })()

  // Calculate chart width
  const chartWidth = Math.max(1200, processedSummaryData.length * 80)

  // Get grand total
  const grandTotal = summaryData?.find(item => item.COLLECTIONBY && item.COLLECTIONBY.toLowerCase() === 'grand total')

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
            background: '#f97316',
            borderBottom: '2px solid #ea580c',
            mb: 0
          }}>
            Brand Collection Summary
          </Box>
          <Box sx={{ p: { xs: 2, md: 2.5 } }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mb: 0.5, fontSize: { xs: 12, md: 14 } }}>
                  Total Invoices
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#06b6d4', fontSize: { xs: 20, md: 24 } }}>
                  {(grandTotal.INVOICECOUNT || 0).toLocaleString('en-IN')}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mb: 0.5, fontSize: { xs: 12, md: 14 } }}>
                  Total Collection
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#f97316', fontSize: { xs: 20, md: 24 } }}>
                  ₹{(grandTotal.AMOUNT || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {/* Chart 1: Collection Amount by Person - Bar Chart */}
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
              background: '#f97316',
              borderBottom: '2px solid #ea580c',
              mb: 0
            }}>
              Collection Amount by Person (Brand Wise)
            </Box>
            <Box sx={{ width: '100%', overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch', p: { xs: 2, md: 2.5 } }}>
              <Box sx={{ minWidth: chartWidth, height: { xs: 350, md: 400 } }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedByAmount} margin={{ top: 10, right: 10, left: 10, bottom: 80 }}>
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
                    label={{ value: 'Collection Amount (₹)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '16px', fontWeight: 'bold' } }}
                  />
                  <RechartsTooltip 
                    formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Collection Amount']}
                    labelFormatter={(label, payload) => {
                      const data = payload?.[0]?.payload;
                      return `Person: ${data?.fullName || label}`;
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
                  <Bar dataKey="amount" fill="#f97316" radius={[8, 8, 0, 0]} stroke="#f97316" strokeWidth={2}>
                    <LabelList 
                      dataKey="amount" 
                      position="top" 
                      formatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                      style={{ fill: '#f97316', fontWeight: 'bold', fontSize: 12 }} 
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Chart 2: Invoice Count by Person - Line Chart */}
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
              Invoice Count by Person (Brand Wise)
            </Box>
            <Box sx={{ width: '100%', overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch', p: { xs: 2, md: 2.5 } }}>
              <Box sx={{ minWidth: chartWidth, height: { xs: 350, md: 400 } }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sortedByAmount} margin={{ top: 10, right: 10, left: 10, bottom: 80 }}>
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
                    label={{ value: 'Invoice Count', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '16px', fontWeight: 'bold' } }}
                  />
                  <RechartsTooltip 
                    formatter={(value) => [value, 'Invoice Count']}
                    labelFormatter={(label, payload) => {
                      const data = payload?.[0]?.payload;
                      return `Person: ${data?.fullName || label}`;
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
                    dataKey="invoiceCount" 
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

        {/* Chart 3: Collection by Payment Mode - Pie Chart */}
        {paymentModeData.length > 0 && (
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
                Collection by Payment Mode (Brand Wise)
              </Box>
              <Box sx={{ p: { xs: 2, md: 2.5 } }}>
              <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 450 : 700}>
                <PieChart>
                  <Pie
                    data={paymentModeData}
                    cx="50%"
                    cy="50%"
                    labelLine={{ stroke: '#64748b', strokeWidth: 0.5, length: window.innerWidth < 768 ? 10 : 20 }}
                    label={(props) => {
                      const { mode, percent, x, y, cx } = props
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
                            {`${mode} ${(percent * 100).toFixed(1)}%`}
                          </text>
                        )
                      }
                      return null
                    }}
                    outerRadius={window.innerWidth < 768 ? 70 : 220}
                    innerRadius={window.innerWidth < 768 ? 30 : 80}
                    fill="#10b981"
                    dataKey="amount"
                    paddingAngle={1}
                  >
                    {paymentModeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        const total = paymentModeData.reduce((sum, item) => sum + item.amount, 0)
                        const percent = ((data.amount / total) * 100).toFixed(1)
                        return (
                          <div style={{
                            background: 'linear-gradient(135deg, #ffffff 0%, #ecfdf5 100%)',
                            border: '3px solid #10b981',
                            borderRadius: '16px',
                            padding: '16px 20px',
                            boxShadow: '0 12px 32px rgba(16, 185, 129, 0.3)',
                            minWidth: '220px'
                          }}>
                            <div style={{
                              fontSize: '18px',
                              fontWeight: '800',
                              color: '#065f46',
                              marginBottom: '8px',
                              borderBottom: '2px solid #10b981',
                              paddingBottom: '8px'
                            }}>
                              {data.mode}
                            </div>
                            <div style={{
                              fontSize: '16px',
                              fontWeight: '700',
                              color: '#059669',
                              marginBottom: '4px'
                            }}>
                              Amount: ₹{data.amount.toLocaleString('en-IN')}
                            </div>
                            <div style={{
                              fontSize: '15px',
                              fontWeight: '600',
                              color: '#10b981'
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
        )}
      </Box>
    </Box>
  )
}