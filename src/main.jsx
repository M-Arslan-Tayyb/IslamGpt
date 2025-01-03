import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast';
import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './features/store/rootReducer.js'
import { Provider } from 'react-redux'



const store = configureStore({
  reducer: rootReducer,
});
//tanStack:
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById('root')).render(


  <QueryClientProvider client={queryClient}>

    <Provider store={store}>

      <App />

      <Toaster />

    </Provider>


  </QueryClientProvider>
)