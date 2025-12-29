import { useState, useMemo } from 'react'
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Chip, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  Alert,
  Divider,
  Grid
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import VisibilityIcon from '@mui/icons-material/Visibility'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import PersonIcon from '@mui/icons-material/Person'
import PhoneIcon from '@mui/icons-material/Phone'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import NotesIcon from '@mui/icons-material/Notes'
import { AnimatedTodoIcon } from '../components/AnimatedIcons'

export default function TodoViewer({ response, reportTitle }) {
  const [selectedTodo, setSelectedTodo] = useState(null)
  const [todoTransactions, setTodoTransactions] = useState([])
  const [loadingTransactions, setLoadingTransactions] = useState(false)
  const [expandedRows, setExpandedRows] = useState(new Set())

  const todos = useMemo(() => {
    if (!response?.recordsets?.[0]) return []
    return response.recordsets[0]
  }, [response])

  const getStatusColor = (statusCode) => {
    switch (statusCode) {
      case 1: return '#22c55e' // Active - Green
      case 2: return '#f59e0b' // In Progress - Orange  
      case 3: return '#ef4444' // Overdue - Red
      case 0: return '#6b7280' // Closed - Gray
      default: return '#3b82f6' // Default - Blue
    }
  }

  const getStatusLabel = (statusCode) => {
    switch (statusCode) {
      case 1: return 'Active'
      case 2: return 'In Progress'
      case 3: return 'Overdue'
      case 0: return 'Closed'
      default: return 'Unknown'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const toggleRowExpansion = (todoNo) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(todoNo)) {
      newExpanded.delete(todoNo)
    } else {
      newExpanded.add(todoNo)
    }
    setExpandedRows(newExpanded)
  }

  const viewTodoTransactions = async (todoNo) => {
    setLoadingTransactions(true)
    setSelectedTodo(todoNo)
    
    try {
      let apiBase = (typeof __API_BASE__ !== 'undefined' && __API_BASE__) ? __API_BASE__ : ''
      if (!apiBase && typeof window !== 'undefined') {
        const host = window.location.hostname
        if (host === 'report.electroitzone.com' || host.endsWith('.report.electroitzone.com')) {
          apiBase = 'https://adm.electroitzone.com'
        }
      }
      
      const url = `${apiBase}/api/query`
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: 'SELECT * FROM tb_TODO_TRANSACTION WHERE TODONO = @todono ORDER BY ENTRYTIME DESC',
          params: { todono: todoNo }
        }),
      })
      
      const json = await response.json()
      if (response.ok && json.recordsets) {
        setTodoTransactions(json.recordsets[0] || [])
      } else {
        setTodoTransactions([])
      }
    } catch (error) {
      console.error('Failed to load TODO transactions:', error)
      setTodoTransactions([])
    } finally {
      setLoadingTransactions(false)
    }
  }

  const closeTodoDialog = () => {
    setSelectedTodo(null)
    setTodoTransactions([])
  }

  if (!todos.length) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <AnimatedTodoIcon size={64} />
        <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          No TODO Items Found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No TODO items found for the selected date range.
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box sx={{ 
        p: { xs: 2, sm: 3 }, 
        background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 1.5, sm: 2 }
      }}>
        <AnimatedTodoIcon size={window.innerWidth < 600 ? 24 : 32} />
        <Box>
          <Typography variant="h5" sx={{ 
            fontWeight: 800, 
            mb: 0.5,
            fontSize: { xs: '1.1rem', sm: '1.5rem' }
          }}>
            {reportTitle}
          </Typography>
          <Typography variant="body2" sx={{ 
            opacity: 0.9,
            fontSize: { xs: '0.8rem', sm: '0.875rem' }
          }}>
            Found {todos.length} TODO item{todos.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
      </Box>

      {/* TODO Cards Grid */}
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
            xl: 'repeat(4, 1fr)'
          },
          gap: { xs: 2, sm: 2.5, md: 3 },
          alignItems: 'stretch',
          justifyItems: 'center'
        }}>
          {todos.map((todo, index) => (
            <Card 
              key={todo.SRNO || index}
              sx={{ 
                width: '100%',
                height: { xs: 520, sm: 560, md: 580 }, // Responsive height
                maxWidth: { xs: '100%', sm: 360, md: 380 }, // Responsive max width
                minWidth: { xs: 280, sm: 320, md: 340 }, // Responsive min width
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                border: `2px solid ${alpha(getStatusColor(todo.STATUSCODE), 0.2)}`,
                background: `linear-gradient(135deg, ${alpha(getStatusColor(todo.STATUSCODE), 0.02)} 0%, ${alpha(getStatusColor(todo.STATUSCODE), 0.08)} 100%)`,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                justifySelf: 'center', // Center cards in grid
                '&:hover': {
                  transform: 'translateY(-6px) scale(1.02)',
                  boxShadow: `0 12px 30px ${alpha(getStatusColor(todo.STATUSCODE), 0.25)}`,
                  borderColor: getStatusColor(todo.STATUSCODE),
                  '& .todo-action-btn': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 12px ${alpha(getStatusColor(todo.STATUSCODE), 0.3)}`
                  }
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: `linear-gradient(90deg, ${getStatusColor(todo.STATUSCODE)}, ${alpha(getStatusColor(todo.STATUSCODE), 0.7)})`
                }
              }}
            >
                <CardContent sx={{ 
                  p: { xs: 2.5, sm: 3, md: 4 }, // Responsive padding
                  display: 'flex', 
                  flexDirection: 'column', 
                  height: '100%',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: { xs: 1.5, sm: 2 }, // Responsive gap
                  '&:last-child': { pb: { xs: 2.5, sm: 3, md: 4 } }
                }}>
                  {/* Header */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    width: '100%',
                    flexDirection: 'column',
                    gap: 1.5
                  }}>
                    <Typography variant="h5" sx={{ 
                      fontWeight: 800, 
                      fontSize: { xs: 16, sm: 18, md: 20 }, // Responsive font size
                      color: 'text.primary',
                      letterSpacing: 0.3,
                      textAlign: 'center'
                    }}>
                      TODO #{todo.TODONO}
                    </Typography>
                    <Chip 
                      label={getStatusLabel(todo.STATUSCODE)}
                      size={window.innerWidth < 600 ? "small" : "medium"}
                      sx={{
                        backgroundColor: alpha(getStatusColor(todo.STATUSCODE), 0.15),
                        color: getStatusColor(todo.STATUSCODE),
                        fontWeight: 700,
                        fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                        height: { xs: 26, sm: 28, md: 30 },
                        border: `1px solid ${alpha(getStatusColor(todo.STATUSCODE), 0.3)}`,
                        '& .MuiChip-label': {
                          px: { xs: 1.5, sm: 2, md: 2.5 }
                        }
                      }}
                    />
                  </Box>

                  {/* Category */}
                  <Box sx={{ 
                    minHeight: 36, 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%'
                  }}>
                    {todo.CATEGORY ? (
                      <Chip 
                        label={todo.CATEGORY}
                        size={window.innerWidth < 600 ? "small" : "medium"}
                        sx={{ 
                          backgroundColor: alpha('#3b82f6', 0.1),
                          color: '#3b82f6',
                          fontWeight: 600,
                          fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                          height: { xs: 26, sm: 28, md: 30 },
                          border: `1px solid ${alpha('#3b82f6', 0.2)}`,
                          '& .MuiChip-label': {
                            px: { xs: 1.5, sm: 2, md: 2.5 }
                          }
                        }}
                      />
                    ) : (
                      <Box sx={{ height: 30 }} /> // Placeholder to maintain consistent spacing
                    )}
                  </Box>

                  {/* Details Section - Fixed height container */}
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 1.5,
                    minHeight: 120, // Reduced to make room for button
                    maxHeight: 120, // Fixed height to prevent expansion
                    overflow: 'hidden',
                    alignItems: 'center',
                    width: '100%'
                  }}>
                    {/* Name */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      gap: 1.5, 
                      minHeight: 28,
                      width: '100%'
                    }}>
                      <PersonIcon sx={{ fontSize: { xs: 16, sm: 18, md: 20 }, color: getStatusColor(todo.STATUSCODE), flexShrink: 0 }} />
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: 600,
                          color: 'text.primary',
                          textAlign: 'center',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: { xs: '180px', sm: '220px', md: '250px' },
                          fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' }
                        }}
                      >
                        {todo.NAME || 'No name specified'}
                      </Typography>
                    </Box>
                    
                    {/* Contact */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      gap: 1.5, 
                      minHeight: 28,
                      width: '100%'
                    }}>
                      <PhoneIcon sx={{ fontSize: { xs: 16, sm: 18, md: 20 }, color: 'text.secondary', flexShrink: 0 }} />
                      <Typography 
                        variant="body1" 
                        color="text.secondary"
                        sx={{
                          textAlign: 'center',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: { xs: '180px', sm: '220px', md: '250px' },
                          fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' }
                        }}
                      >
                        {todo.CONTACTNO || 'No contact'}
                      </Typography>
                    </Box>

                    {/* Reminder Date */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      gap: 1.5, 
                      minHeight: 28,
                      width: '100%'
                    }}>
                      <CalendarTodayIcon sx={{ fontSize: { xs: 16, sm: 18, md: 20 }, color: 'text.secondary', flexShrink: 0 }} />
                      <Typography variant="body1" color="text.secondary" sx={{ 
                        fontWeight: 500, 
                        textAlign: 'center',
                        fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' }
                      }}>
                        {formatDate(todo.REMINDERDATE)}
                      </Typography>
                    </Box>

                    {/* Assigned Person */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      gap: 1.5, 
                      minHeight: 28,
                      width: '100%'
                    }}>
                      <PersonIcon sx={{ fontSize: { xs: 16, sm: 18, md: 20 }, color: 'text.secondary', flexShrink: 0 }} />
                      <Typography 
                        variant="body1" 
                        color="text.secondary"
                        sx={{
                          textAlign: 'center',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: { xs: '180px', sm: '220px', md: '250px' },
                          fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' }
                        }}
                      >
                        {todo.ACTIONABLEPERSON || 'Unassigned'}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Narration - Fixed height with scroll */}
                  <Box sx={{ 
                    minHeight: 70,
                    maxHeight: 90, // Reduced max height
                    overflow: 'hidden',
                    width: '100%',
                    textAlign: 'center'
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      gap: 1.5, 
                      mb: 1.5 
                    }}>
                      <NotesIcon sx={{ fontSize: { xs: 16, sm: 18, md: 20 }, color: 'text.secondary', flexShrink: 0 }} />
                      <Typography variant="body1" sx={{ 
                        fontWeight: 600, 
                        color: 'text.primary', 
                        fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                        textAlign: 'center'
                      }}>
                        Description
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      sx={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: { xs: 2, sm: 3 },
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.5,
                        fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
                        textAlign: 'center',
                        px: { xs: 1, sm: 1.5, md: 2 }
                      }}
                    >
                      {todo.NARRATION || 'No description provided'}
                    </Typography>
                  </Box>

                  {/* Address - Fixed height */}
                  <Box sx={{ 
                    minHeight: 50,
                    maxHeight: 70, // Fixed max height
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    width: '100%',
                    textAlign: 'center'
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      gap: 1.5 
                    }}>
                      <LocationOnIcon sx={{ fontSize: { xs: 16, sm: 18, md: 20 }, color: 'text.secondary', flexShrink: 0 }} />
                      <Typography variant="body1" sx={{ 
                        fontWeight: 600, 
                        color: 'text.primary', 
                        fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                        textAlign: 'center'
                      }}>
                        Address
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      sx={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.4,
                        fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
                        textAlign: 'center',
                        px: { xs: 1, sm: 1.5, md: 2 },
                        maxWidth: { xs: '200px', sm: '250px', md: '300px' }
                      }}
                    >
                      {todo.ADDRESS || 'No address provided'}
                    </Typography>
                  </Box>

                  {/* Action Button - Always at bottom with fixed position */}
                  <Box sx={{ 
                    mt: 'auto', 
                    width: '100%',
                    pt: 2, // Add top padding to separate from content
                    pb: 1  // Add bottom padding for visual balance
                  }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<VisibilityIcon />}
                      onClick={() => viewTodoTransactions(todo.TODONO)}
                      className="todo-action-btn"
                      sx={{
                        background: `linear-gradient(135deg, ${getStatusColor(todo.STATUSCODE)}, ${alpha(getStatusColor(todo.STATUSCODE), 0.8)})`,
                        color: 'white',
                        fontWeight: 700,
                        fontSize: { xs: '0.8rem', sm: '0.85rem' },
                        py: { xs: 1, sm: 1.2 }, // Responsive padding
                        borderRadius: 2.5,
                        textTransform: 'none',
                        boxShadow: `0 3px 10px ${alpha(getStatusColor(todo.STATUSCODE), 0.3)}`,
                        transition: 'all 0.3s ease',
                        minHeight: 44, // Ensure minimum button height
                        '&:hover': {
                          background: `linear-gradient(135deg, ${getStatusColor(todo.STATUSCODE)}, ${alpha(getStatusColor(todo.STATUSCODE), 0.9)})`,
                          boxShadow: `0 5px 15px ${alpha(getStatusColor(todo.STATUSCODE), 0.4)}`
                        }
                      }}
                    >
                      View Actions
                    </Button>
                  </Box>
                </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* TODO Transactions Dialog */}
      <Dialog 
        open={!!selectedTodo} 
        onClose={closeTodoDialog}
        maxWidth="md"
        fullWidth
        fullScreen={window.innerWidth < 600} // Full screen on mobile
        PaperProps={{
          sx: { 
            borderRadius: { xs: 0, sm: 2 }, // No border radius on mobile
            m: { xs: 0, sm: 2 }, // No margin on mobile
            maxHeight: { xs: '100vh', sm: '90vh' } // Full height on mobile
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 1, sm: 2 },
          p: { xs: 2, sm: 3 },
          fontSize: { xs: '1rem', sm: '1.25rem' }
        }}>
          <NotesIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
          <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            TODO #{selectedTodo} - Action History
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ p: { xs: 1, sm: 0 } }}>
          {loadingTransactions ? (
            <Box sx={{ p: { xs: 3, sm: 4 }, textAlign: 'center' }}>
              <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Loading actions...</Typography>
            </Box>
          ) : todoTransactions.length === 0 ? (
            <Box sx={{ p: { xs: 3, sm: 4 }, textAlign: 'center' }}>
              <Alert severity="info" sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
                No actions recorded for this TODO item yet.
              </Alert>
            </Box>
          ) : (
            <TableContainer sx={{ 
              maxHeight: { xs: 'calc(100vh - 200px)', sm: '60vh' },
              overflowX: 'auto'
            }}>
              <Table stickyHeader size={window.innerWidth < 600 ? "small" : "medium"}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                    <TableCell sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      p: { xs: 1, sm: 2 }
                    }}>
                      Date/Time
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      p: { xs: 1, sm: 2 },
                      display: { xs: 'none', sm: 'table-cell' }
                    }}>
                      Action By
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      p: { xs: 1, sm: 2 }
                    }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      p: { xs: 1, sm: 2 }
                    }}>
                      Remarks
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      p: { xs: 1, sm: 2 },
                      display: { xs: 'none', md: 'table-cell' }
                    }}>
                      Next Reminder
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {todoTransactions.map((transaction, index) => (
                    <TableRow key={transaction.SRNO || index}>
                      <TableCell sx={{ p: { xs: 1, sm: 2 } }}>
                        <Typography variant="body2" sx={{ 
                          fontWeight: 500,
                          fontSize: { xs: '0.7rem', sm: '0.875rem' }
                        }}>
                          {transaction.ENTRYTIME ? new Date(transaction.ENTRYTIME).toLocaleString() : 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ 
                        p: { xs: 1, sm: 2 },
                        display: { xs: 'none', sm: 'table-cell' }
                      }}>
                        <Typography variant="body2" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                          {transaction.ACTIONTAKENBY || transaction.ENTRYUSER || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ p: { xs: 1, sm: 2 } }}>
                        <Chip 
                          label={getStatusLabel(transaction.STATUSCODE)}
                          size="small"
                          sx={{
                            backgroundColor: alpha(getStatusColor(transaction.STATUSCODE), 0.1),
                            color: getStatusColor(transaction.STATUSCODE),
                            fontWeight: 500,
                            fontSize: { xs: '0.6rem', sm: '0.75rem' },
                            height: { xs: 20, sm: 24 }
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ p: { xs: 1, sm: 2 } }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            maxWidth: { xs: 120, sm: 200 },
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            fontSize: { xs: '0.7rem', sm: '0.875rem' }
                          }}
                        >
                          {transaction.ACTIONREMARK || 'No remarks'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ 
                        p: { xs: 1, sm: 2 },
                        display: { xs: 'none', md: 'table-cell' }
                      }}>
                        <Typography variant="body2" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                          {formatDate(transaction.REMINDER_DATE)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        
        <DialogActions sx={{ 
          p: { xs: 2, sm: 3 },
          gap: { xs: 1, sm: 2 }
        }}>
          <Button 
            onClick={closeTodoDialog} 
            variant="contained"
            fullWidth={window.innerWidth < 600}
            sx={{
              fontSize: { xs: '0.85rem', sm: '0.9rem' },
              py: { xs: 1, sm: 1.2 },
              minWidth: { xs: 'auto', sm: 100 }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}