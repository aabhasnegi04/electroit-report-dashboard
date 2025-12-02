import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';

// Helper function to convert data to worksheet format
const dataToWorksheet = (data, headers) => {
  if (!data || data.length === 0) {
    console.warn('No data provided to dataToWorksheet');
    return headers ? [headers] : [];
  }
  
  // If headers are provided, use them, otherwise use the first row as headers
  const worksheetData = headers ? [headers] : [];
  
  // Add data rows
  if (Array.isArray(data)) {
    data.forEach((row, index) => {
      if (typeof row === 'object' && row !== null) {
        // Convert object to array based on headers or object keys
        const rowArray = headers ? 
          headers.map(header => {
            // Handle different property name mappings
            const value = row[header] || row[header.toLowerCase()] || row[header.toUpperCase()] || '';
            return value;
          }) :
          Object.values(row);
        worksheetData.push(rowArray);
      } else {
        worksheetData.push([row]);
      }
    });
  }
  
  console.log('Worksheet data created:', worksheetData.length, 'rows');
  return worksheetData;
};

// Export to Excel
export const exportToExcel = (data, filename, sheetNames = ['Data']) => {
  try {
    const workbook = XLSX.utils.book_new();
    
    // Handle multiple datasets (for "both" export type)
    if (Array.isArray(data) && data.length > 0) {
      data.forEach((dataset, index) => {
        const { data: datasetData, headers, sheetName } = dataset;
        const worksheetData = dataToWorksheet(datasetData, headers);
        
        if (worksheetData.length > 0) {
          const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
          XLSX.utils.book_append_sheet(
            workbook, 
            worksheet, 
            sheetName || sheetNames[index] || `Sheet${index + 1}`
          );
        }
      });
    } else {
      // Single dataset
      const worksheetData = dataToWorksheet(data.data || data, data.headers);
      if (worksheetData.length > 0) {
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetNames[0]);
      }
    }
    
    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    saveAs(blob, `${filename}.xlsx`);
    return true;
  } catch (error) {
    console.error('Excel export error:', error);
    return false;
  }
};

// Export to CSV
export const exportToCSV = (data, filename) => {
  try {
    let csvContent = '';
    
    // Handle multiple datasets
    if (Array.isArray(data) && data.length > 0) {
      data.forEach((dataset, index) => {
        const { data: datasetData, headers, sheetName } = dataset;
        
        if (sheetName) {
          csvContent += `# ${sheetName}\n`;
        }
        
        const csvData = dataToWorksheet(datasetData, headers);
        
        csvData.forEach(row => {
          csvContent += row.map(cell => 
            typeof cell === 'string' && cell.includes(',') ? 
            `"${cell}"` : cell
          ).join(',') + '\n';
        });
        
        if (index < data.length - 1) {
          csvContent += '\n\n'; // Separate datasets with blank lines
        }
      });
    } else {
      // Single dataset
      const csvData = dataToWorksheet(data.data || data, data.headers);
      csvContent = csvData.map(row => 
        row.map(cell => 
          typeof cell === 'string' && cell.includes(',') ? 
          `"${cell}"` : cell
        ).join(',')
      ).join('\n');
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${filename}.csv`);
    return true;
  } catch (error) {
    console.error('CSV export error:', error);
    return false;
  }
};

// Process report data for export
export const processReportDataForExport = (reportData, chartData) => {
  const exportData = [];
  
  // Process table data
  if (reportData && reportData.recordsets) {
    reportData.recordsets.forEach((recordset, index) => {
      if (recordset && recordset.length > 0) {
        const headers = Object.keys(recordset[0]);
        exportData.push({
          data: recordset,
          headers,
          sheetName: `Table ${index + 1}`
        });
      }
    });
  }
  
  // Process chart data
  if (chartData && chartData.length > 0) {
    chartData.forEach(chart => {
      if (chart.data && chart.headers) {
        exportData.push({
          data: chart.data,
          headers: chart.headers,
          sheetName: chart.name.replace('Data', ' Chart').replace(/([A-Z])/g, ' $1').trim()
        });
      }
    });
  }
  
  return exportData;
};

// Main export function
export const exportData = async (exportType, exportFormat, reportData, chartData, reportTitle, includeCharts = false) => {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${reportTitle || 'Report'}_${timestamp}`;
  
  let dataToExport = [];
  
  if (exportType === 'tables') {
    // Export only table data
    if (reportData && reportData.recordsets) {
      reportData.recordsets.forEach((recordset, index) => {
        if (recordset && recordset.length > 0) {
          const headers = Object.keys(recordset[0]);
          dataToExport.push({
            data: recordset,
            headers,
            sheetName: `Table ${index + 1}`
          });
        }
      });
    }
  } else if (exportType === 'charts') {
    // Export only chart data
    if (chartData && chartData.length > 0) {
      dataToExport = chartData.map(chart => ({
        data: chart.data,
        headers: chart.headers,
        sheetName: chart.name.replace('Data', ' Chart').replace(/([A-Z])/g, ' $1').trim()
      }));
    }
  } else if (exportType === 'both') {
    // Export both tables and charts
    dataToExport = processReportDataForExport(reportData, chartData);
  }
  
  if (dataToExport.length === 0) {
    console.error('Export data structure:', { exportType, reportData, chartData, dataToExport });
    throw new Error('No data available for export');
  }
  
  console.log('Exporting data:', dataToExport);
  
  // Capture chart images if requested
  let chartImageData = [];
  if (includeCharts && (exportType === 'charts' || exportType === 'both')) {
    try {
      const chartIds = [
        'customer-units-chart',
        'customer-revenue-chart', 
        'brand-units-chart',
        'brand-revenue-chart',
        'seller-purchase-chart',
        'brand-purchase-chart'
      ];
      
      for (const chartId of chartIds) {
        const imageData = await captureChartImage(chartId);
        if (imageData) {
          const sheetName = chartId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
          chartImageData.push({
            sheetName: sheetName,
            imageData: imageData
          });
        }
      }
    } catch (error) {
      console.error('Error capturing chart images:', error);
    }
  }
  
  // Perform export based on format
  if (exportFormat === 'excel') {
    if (includeCharts && chartImageData.length > 0) {
      return await exportToExcelWithCharts(dataToExport, filename, chartImageData);
    } else {
      return exportToExcel(dataToExport, filename);
    }
  } else if (exportFormat === 'csv') {
    return exportToCSV(dataToExport, filename);
  }
  
  return false;
};

// Function to capture chart images
const captureChartImage = async (chartElementId, options = {}) => {
  try {
    const element = document.getElementById(chartElementId);
    if (!element) {
      console.warn(`Chart element with id "${chartElementId}" not found`);
      return null;
    }

    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher resolution
      useCORS: true,
      allowTaint: true,
      ...options
    });

    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error capturing chart image:', error);
    return null;
  }
}

// Enhanced Excel export with chart images
export const exportToExcelWithCharts = async (data, filename, chartImageData = []) => {
  try {
    const workbook = XLSX.utils.book_new();
    
    // Handle multiple datasets
    if (Array.isArray(data) && data.length > 0) {
      data.forEach((dataset, index) => {
        const { data: datasetData, headers, sheetName } = dataset;
        const worksheetData = dataToWorksheet(datasetData, headers);
        
        if (worksheetData.length > 0) {
          const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
          
          // Add chart images if available
          const chartImage = chartImageData.find(img => img.sheetName === sheetName);
          if (chartImage && chartImage.imageData) {
            // Add image placeholder in Excel (ExcelJS would be better for this, but using XLSX for now)
            // For now, we'll add a note indicating where the chart should be
            const lastRow = worksheetData.length + 1;
            XLSX.utils.sheet_add_aoa(worksheet, [['', ''], ['Chart Image:', 'See separate image file']], { 
              origin: `A${lastRow + 1}` 
            });
          }
          
          XLSX.utils.book_append_sheet(
            workbook, 
            worksheet, 
            sheetName || `Sheet${index + 1}`
          );
        }
      });
    } else {
      // Single dataset
      const worksheetData = dataToWorksheet(data.data || data, data.headers);
      if (worksheetData.length > 0) {
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
      }
    }
    
    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    saveAs(blob, `${filename}.xlsx`);
    
    // Save chart images separately
    chartImageData.forEach(chart => {
      if (chart.imageData) {
        const link = document.createElement('a');
        link.download = `${filename}_${chart.sheetName.replace(/\s+/g, '_')}.png`;
        link.href = chart.imageData;
        link.click();
      }
    });
    
    return true;
  } catch (error) {
    console.error('Excel export with charts error:', error);
    return false;
  }
}
