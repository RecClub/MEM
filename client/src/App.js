import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

import useDarkMode from './hooks/useDarkMode';
import AppBar from './components/AppBar';
import MainPage from './pages/MainPage';
import CoachPortal from './pages/CoachPortal';
import MemberPortal from './pages/MemberPortal';
import TreasurerPortal from './pages/TreasurerPortal';
import PrivateRoute from './components/PrivateRoute';
import { UserStore } from './contexts/UserContext';

function App() {
  const theme = createTheme({
    palette: {
      mode: useDarkMode() ? 'dark' : 'light',
    }
  });

  return (
    <React.Fragment>
      <UserStore>
        <ThemeProvider theme={theme}>
          <CssBaseline enableColorScheme />
          <BrowserRouter>
            <AppBar />
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/Coach" element={<PrivateRoute><CoachPortal /></PrivateRoute>} />
              <Route path="/Member" element={<PrivateRoute><MemberPortal /></PrivateRoute>} />
              <Route path="/Treasurer" element={<PrivateRoute><TreasurerPortal /></PrivateRoute>} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </UserStore>
    </React.Fragment>
  );
}

export default App;
