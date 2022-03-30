import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { CssBaseline } from '@mui/material';

import useDarkMode from './hooks/useDarkMode';

function App() {
  const theme = createTheme({
    palette: {
      mode: useDarkMode() ? 'dark' : 'light',
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <Button variant="contained">Hello World</Button>
      <TextField id="outlined-basic" label="Outlined" variant="outlined" />
    </ThemeProvider>
  );
}

export default App;
