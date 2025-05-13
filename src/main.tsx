import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/index.scss'
import { NextUIProvider } from '@nextui-org/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './contexts/app.context'
import React from 'react'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NextUIProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AppProvider>
            <App />
          </AppProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </NextUIProvider>
  </React.StrictMode>
)
