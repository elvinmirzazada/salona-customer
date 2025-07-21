import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#0D9488',
      light: '#14B8A6',
      dark: '#0F766E',
    },
    secondary: {
      main: '#333333',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
  },
});