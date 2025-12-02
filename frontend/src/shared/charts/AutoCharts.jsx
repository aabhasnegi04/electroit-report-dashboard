import { Box, Paper, Stack, Typography } from '@mui/material'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid, BarChart, Bar, LineChart, Line } from 'recharts'

export default function AutoCharts({ rows }) {
  if (!rows || rows.length === 0) return null
  const sample = rows[0]
  const numericKeys = Object.keys(sample).filter((k) => typeof sample[k] === 'number')
  const dateKey = Object.keys(sample).find((k) => /date|time|day/i.test(k)) || Object.keys(sample)[0]

  const chartData = rows.map((r, i) => ({ index: i, ...r }))

  if (numericKeys.length === 0) return null

  return (
    <Stack spacing={2}>
      <Box sx={{ p: { xs: 1, md: 2 }, height: { xs: 260, md: 360 }, width: '100%', minWidth: 0 }}>
        <Typography sx={{ mb: 1.5 }} variant="h6">Area Trend</Typography>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
            <XAxis dataKey={dateKey} stroke="#94a3b8" tick={{ fontSize: 14, fontWeight: 600 }} interval="preserveEnd" minTickGap={8} />
            <YAxis stroke="#94a3b8" tick={{ fontSize: 14, fontWeight: 600 }} width={60} />
            <RechartsTooltip />
            <Area type="monotone" dataKey={numericKeys[0]} stroke="#4f46e5" fillOpacity={1} fill="url(#colorPrimary)" />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
      {numericKeys.length > 1 && (
        <Box sx={{ p: { xs: 1, md: 2 }, height: { xs: 260, md: 360 }, width: '100%', minWidth: 0 }}>
          <Typography sx={{ mb: 1.5 }} variant="h6">Comparative Bars</Typography>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey={dateKey} stroke="#94a3b8" tick={{ fontSize: 14, fontWeight: 600 }} interval="preserveEnd" minTickGap={8} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 14, fontWeight: 600 }} width={60} />
              <RechartsTooltip />
              {numericKeys.slice(0, 3).map((k, idx) => (
                <Bar key={k} dataKey={k} fill={["#4f46e5","#f43f5e","#22c55e"][idx % 3]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
      <Box sx={{ p: { xs: 1, md: 2 }, height: { xs: 260, md: 360 }, width: '100%', minWidth: 0 }}>
        <Typography sx={{ mb: 1.5 }} variant="h6">Line Overview</Typography>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
            <XAxis dataKey={dateKey} stroke="#94a3b8" tick={{ fontSize: 14, fontWeight: 600 }} interval="preserveEnd" minTickGap={8} />
            <YAxis stroke="#94a3b8" tick={{ fontSize: 14, fontWeight: 600 }} width={60} />
            <RechartsTooltip />
            {numericKeys.slice(0, 2).map((k, idx) => (
              <Line key={k} type="monotone" dataKey={k} stroke={["#4f46e5","#f43f5e"][idx % 2]} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Stack>
  )
}


