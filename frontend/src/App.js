import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/login';
import Dashboard from './Pages/dashboard';
import Schedule from './Pages/schedule';
import Minutes from './Pages/minutes'; // Import the Minutes component
import { Meeting } from './Pages/meeting';
import ComposeEmail from './Components/compose';
import Layout from './Components/Layout';
import ProtectedRoute from './Components/ProtectedRoute';
import Important from './Pages/important';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/schedule" 
          element={
            <ProtectedRoute>
              <Layout>
                <Schedule />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/minutes" 
          element={
            <ProtectedRoute>
              <Layout>
                <Minutes />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/meeting" 
          element={
            <ProtectedRoute>
              <Layout>
                <Meeting />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/compose" 
          element={
            <ProtectedRoute>
              <Layout>
                <ComposeEmail />
              </Layout>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;