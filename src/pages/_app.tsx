import '@/styles/globals.css';
import '@/styles/loader.css';
import '@/styles/extras.tailwind.css';
import '@/styles/project_card.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { store, persistor } from '@/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import NProgressConfig from '@/config/nprogress';
import socketService from '@/config/ws';
import { Inter } from 'next/font/google';
import ThemeCheck from '@/config/theme';

NProgressConfig();

const inter = Inter({
  subsets: ['latin'],
  variable: '--inter-font',
});

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    socketService.connect();
    ThemeCheck();
    return () => {
      socketService.disconnect();
    };
  }, []);

  return (
    <main className={`${inter.variable}`}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ToastContainer containerId="main" />
          <ToastContainer containerId="messaging" limit={5} />
          <Component {...pageProps} />
        </PersistGate>
      </Provider>
    </main>
  );
}
