import { Box, Paper, Stack, Typography } from '@mui/material'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid, PieChart, Pie, Cell, LabelList, Legend } from 'recharts'

export default function CurrentStockCharts({ data }) {
  if (!data || !data.recordsets || data.recordsets.length < 3) {
    return null
  }

  const [detailedStock, summaryStock, brandSummary] = data.recordsets

  // Process data for charts
  const brandStockQtyData = brandSummary?.map(item => ({
    name: item.BRAND || 'Unknown',
    stockQty: item.STOCK_QTY || 0,
    value: item.STOCK_QTY || 0
  })) || []

  const brandStockValueData = brandSummary?.map(item => ({
    name: item.BRAND || 'Unknown',
    stockValue: item.STOCK_VAL || 0,
    value: item.STOCK_VAL || 0
  })) || []

  // Colors for pie chart
  const COLORS = ['#8b5cf6', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444', '#6366f1', '#ec4899', '#84cc16']

  return (
    <Box sx={{ m: 0 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {/* Chart 1: Stock Quantity by Brand - Bar Chart */}
        <Box sx={{ width: '100%' }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 2.5 },
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
              background: '#8b5cf6',
              borderBottom: '2px solid #7c3aed',
              mb: 2
            }}>
              Stock Quantity by Brand
            </Box>
            <Box sx={{ width: '100%', overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch' }}>
              <Box sx={{ minWidth: { xs: Math.max(600, brandStockQtyData.length * 80), md: '100%' }, height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={brandStockQtyData} margin={{ top: 30, right: 10, left: 10, bottom: 50 }}>
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
                  label={{ value: 'Stock Quantity', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '16px', fontWeight: 'bold' } }}
                />
                <RechartsTooltip 
                  formatter={(value, name) => [value.toLocaleString(), 'Stock Qty']}
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
                <Bar dataKey="stockQty" fill="#8b5cf6" radius={[8, 8, 0, 0]} stroke="#8b5cf6" strokeWidth={2}>
                  <LabelList dataKey="stockQty" position="top" style={{ fill: '#8b5cf6', fontWeight: 'bold', fontSize: 14 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Chart 2: Stock Value by Brand - Pie Chart */}
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
              background: '#06b6d4',
              borderBottom: '2px solid #0891b2',
              mb: 0
            }}>
              Stock Value by Brand
            </Box>
            <Box sx={{ p: { xs: 2, md: 2.5 } }}>
            <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 450 : 700}>
              <PieChart>
                <Pie
                  data={brandStockValueData}
                  cx="50%"
                  cy="50%"
                  labelLine={{ stroke: '#64748b', strokeWidth: 0.5, length: window.innerWidth < 768 ? 10 : 20 }}
                  label={(props) => {
                    const { name, percent, x, y, cx, cy, midAngle, innerRadius, outerRadius } = props
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
                  outerRadius={window.innerWidth < 768 ? 70 : 220}
                  innerRadius={window.innerWidth < 768 ? 30 : 80}
                  fill="#06b6d4"
                  dataKey="stockValue"
                  paddingAngle={1}
                >
                  {brandStockValueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0]
                      const total = brandStockValueData.reduce((sum, item) => sum + item.stockValue, 0)
                      const percent = ((data.value / total) * 100).toFixed(1)
                      return (
                        <div style={{
                          background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
                          border: '3px solid #06b6d4',
                          borderRadius: '16px',
                          padding: '16px 20px',
                          boxShadow: '0 12px 32px rgba(6, 182, 212, 0.3)',
                          minWidth: '200px'
                        }}>
                          <div style={{
                            fontSize: '18px',
                            fontWeight: '800',
                            color: '#0e7490',
                            marginBottom: '8px',
                            borderBottom: '2px solid #06b6d4',
                            paddingBottom: '8px'
                          }}>
                            {data.name}
                          </div>
                          <div style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            color: '#0891b2',
                            marginBottom: '4px'
                          }}>
                            Stock Value: ₹{data.value.toLocaleString('en-IN')}
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
