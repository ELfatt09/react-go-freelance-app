import Layout from './layout/Layout';
import { AuthProvider } from './authContext';
import ProtectedRoute from './protectedRoute';
import Register from './pages/auth/register';
import Edit from './pages/auth/edit';
import Login from './pages/auth/login';
import { BrowserRouter as Router,  Route, Routes } from 'react-router-dom';
import Home from './pages/Home';

function App() {
  return (
    <div id='app'>
        <Router>
          <AuthProvider>
          <Layout>
            <Routes>
            
              <Route path="/" element={<Home />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/user/edit" element={<ProtectedRoute><Edit /></ProtectedRoute>} />
            </Routes>
          </Layout>
          </AuthProvider>
        </Router>
    </div>
  );
}

export default App;
