import React, { useState } from 'react';
import {
  Paper,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Stack,
  Divider,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Download,
  TableChart,
  BarChart,
  Dashboard
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

const ExportOptions = ({ 
  reportData, 
  chartData, 
  reportTitle, 
  isExporting, 
  onExport 
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExport = (exportType, exportFormat, includeCharts = false) => {
    onExport(exportType, exportFormat, includeCharts);
    handleClose();
  };

  const hasData = reportData && (reportData.length > 0 || Object.keys(reportData).length > 0);
  const hasCharts = chartData && chartData.length > 0;

  return (
    <>
      {/* Export Button */}
      <Button
        variant="contained"
        onClick={handleClick}
        disabled={isExporting || (!hasData && !hasCharts)}
        startIcon={<Download />}
        sx={{
          minWidth: 'auto',
          px: { xs: 2, md: 2.5 },
          py: { xs: 0.75, md: 1 },
          fontWeight: 700,
          fontSize: { xs: 12, md: 14 },
          borderRadius: 2,
          textTransform: 'none',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
          boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #7c3aed 0%, #0891b2 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(139, 92, 246, 0.4)'
          },
          '&:disabled': {
            background: '#e2e8f0',
            color: '#94a3b8'
          },
          transition: 'all 0.2s ease'
        }}
      >
        {isExporting ? 'Exporting...' : 'Export'}
      </Button>

      {/* Export Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 280,
            maxWidth: 350,
            p: 2,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            backdropFilter: 'blur(10px)',
            border: '2px solid #e0e7ff',
            borderRadius: 3,
            boxShadow: '0 12px 32px rgba(79, 70, 229, 0.15)'
          }
        }}
      >
        {/* Export Type Section */}
        <Typography variant="subtitle2" sx={{ 
          fontWeight: 800, 
          mb: 2, 
          px: 1,
          fontSize: 16,
          background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Export Options
        </Typography>
        
        <MenuItem 
          onClick={() => handleExport('tables', 'excel')} 
          disabled={!hasData}
          sx={{ 
            mb: 0.5,
            borderRadius: 2,
            '&:hover': {
              background: 'linear-gradient(135deg, #ede9fe 0%, #dbeafe 100%)'
            }
          }}
        >
          <ListItemIcon>
            <TableChart sx={{ fontSize: 22, color: '#4f46e5' }} />
          </ListItemIcon>
          <ListItemText 
            primary={<span style={{ fontWeight: 600, fontSize: 14 }}>Tables (Excel)</span>}
            secondary={<span style={{ fontSize: 12 }}>{hasData ? "Export all table data" : "No table data"}</span>}
          />
        </MenuItem>

        <MenuItem 
          onClick={() => handleExport('tables', 'csv')} 
          disabled={!hasData}
          sx={{ 
            mb: 0.5,
            borderRadius: 2,
            '&:hover': {
              background: 'linear-gradient(135deg, #ede9fe 0%, #dbeafe 100%)'
            }
          }}
        >
          <ListItemIcon>
            <TableChart sx={{ fontSize: 22, color: '#4f46e5' }} />
          </ListItemIcon>
          <ListItemText 
            primary={<span style={{ fontWeight: 600, fontSize: 14 }}>Tables (CSV)</span>}
            secondary={<span style={{ fontSize: 12 }}>{hasData ? "Export all table data" : "No table data"}</span>}
          />
        </MenuItem>

        <MenuItem 
          onClick={() => handleExport('charts', 'excel')} 
          disabled={!hasCharts}
          sx={{ 
            mb: 0.5,
            borderRadius: 2,
            '&:hover': {
              background: 'linear-gradient(135deg, #fef3c7 0%, #dbeafe 100%)'
            }
          }}
        >
          <ListItemIcon>
            <BarChart sx={{ fontSize: 22, color: '#f59e0b' }} />
          </ListItemIcon>
          <ListItemText 
            primary={<span style={{ fontWeight: 600, fontSize: 14 }}>Chart Data (Excel)</span>}
            secondary={<span style={{ fontSize: 12 }}>{hasCharts ? "Export chart data only" : "No chart data"}</span>}
          />
        </MenuItem>

        <MenuItem 
          onClick={() => handleExport('charts', 'excel', true)} 
          disabled={!hasCharts}
          sx={{ 
            mb: 0.5,
            borderRadius: 2,
            '&:hover': {
              background: 'linear-gradient(135deg, #fef3c7 0%, #d1fae5 100%)'
            }
          }}
        >
          <ListItemIcon>
            <BarChart sx={{ fontSize: 22, color: '#22c55e' }} />
          </ListItemIcon>
          <ListItemText 
            primary={<span style={{ fontWeight: 600, fontSize: 14 }}>Full Charts (Excel + Images)</span>}
            secondary={<span style={{ fontSize: 12 }}>{hasCharts ? "Export charts as images + data" : "No chart data"}</span>}
          />
        </MenuItem>

        <MenuItem 
          onClick={() => handleExport('charts', 'csv')} 
          disabled={!hasCharts}
          sx={{ 
            mb: 1,
            borderRadius: 2,
            '&:hover': {
              background: 'linear-gradient(135deg, #fef3c7 0%, #dbeafe 100%)'
            }
          }}
        >
          <ListItemIcon>
            <BarChart sx={{ fontSize: 22, color: '#f59e0b' }} />
          </ListItemIcon>
          <ListItemText 
            primary={<span style={{ fontWeight: 600, fontSize: 14 }}>Chart Data (CSV)</span>}
            secondary={<span style={{ fontSize: 12 }}>{hasCharts ? "Export chart data only" : "No chart data"}</span>}
          />
        </MenuItem>

        <Divider sx={{ my: 1.5, borderColor: '#e0e7ff' }} />

        <MenuItem 
          onClick={() => handleExport('both', 'excel')} 
          sx={{ 
            mb: 0.5,
            borderRadius: 2,
            '&:hover': {
              background: 'linear-gradient(135deg, #d1fae5 0%, #dbeafe 100%)'
            }
          }}
        >
          <ListItemIcon>
            <Dashboard sx={{ fontSize: 22, color: '#22c55e' }} />
          </ListItemIcon>
          <ListItemText 
            primary={<span style={{ fontWeight: 600, fontSize: 14 }}>Everything (Excel)</span>}
            secondary={<span style={{ fontSize: 12 }}>Tables & charts in separate sheets</span>}
          />
        </MenuItem>

        <MenuItem 
          onClick={() => handleExport('both', 'csv')} 
          sx={{ 
            borderRadius: 2,
            '&:hover': {
              background: 'linear-gradient(135deg, #d1fae5 0%, #dbeafe 100%)'
            }
          }}
        >
          <ListItemIcon>
            <Dashboard sx={{ fontSize: 22, color: '#22c55e' }} />
          </ListItemIcon>
          <ListItemText 
            primary={<span style={{ fontWeight: 600, fontSize: 14 }}>Everything (CSV)</span>}
            secondary={<span style={{ fontSize: 12 }}>Tables & charts in one file</span>}
          />
        </MenuItem>
      </Menu>
    </>
  );
};

export default ExportOptions;
