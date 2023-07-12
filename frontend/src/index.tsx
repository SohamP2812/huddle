import '@fontsource/plus-jakarta-sans/800.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import reportWebVitals from './reportWebVitals';
import './index.css';
import { ChakraProvider } from '@chakra-ui/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { extendTheme, Spacer } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';

import { App } from 'App';

import { theme as baseTheme } from 'theme';
import { Header } from 'components/Header/Header';
import { Footer } from 'components/Footer/Footer';

const container = document.getElementById('root')!;
const root = createRoot(container);

const theme = extendTheme(
  {
    fonts: {
      heading: `'Plus Jakarta Sans', sans-serif`
    }
  },
  baseTheme
);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ChakraProvider>
        <Provider store={store}>
          <BrowserRouter>
            <Header />
            <Spacer h="73px" />
            <App />
            <Footer />
          </BrowserRouter>
        </Provider>
      </ChakraProvider>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
