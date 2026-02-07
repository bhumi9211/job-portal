import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import App from './App.jsx'
import { PostsProvider } from './context/PostsContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { MessagesProvider } from './context/MessageContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter >
  <AuthProvider>
    <MessagesProvider>
    <PostsProvider >
    <App />
    </PostsProvider>
    </MessagesProvider>
    </AuthProvider>
  </BrowserRouter>
)
