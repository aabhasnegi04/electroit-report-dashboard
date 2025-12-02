import { createTheme } from '@mui/material/styles'
import '@fontsource/nunito/200.css'
import '@fontsource/nunito/300.css'
import '@fontsource/nunito/400.css'
import '@fontsource/nunito/600.css'
import '@fontsource/nunito/700.css'
import '@fontsource/nunito/800.css'

export function createAppTheme(mode) {
  return createTheme({
    palette: {
      mode,
      primary: { main: '#4f46e5' },
      secondary: { main: '#f43f5e' },
      background: mode === 'light'
        ? { default: '#ffffff', paper: '#ffffff' }
        : { default: '#0a0a0a', paper: '#111111' },
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: 'Nunito, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Noto Sans, Apple Color Emoji, Segoe UI Emoji',
      h4: { fontWeight: 700 },
    },
    components: {
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    },
  })
}


