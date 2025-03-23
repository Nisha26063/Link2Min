import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/login';
import Dashboard from './Pages/dashboard';
import Schedule from './Pages/schedule';
import Minutes from './Pages/minutes'; // Import the Minutes component
import { Meeting } from './Pages/meeting';
import ComposeEmail from './Components/compose';
import Layout from './Components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/schedule" element={
          <Layout>
            <Schedule />
          </Layout>
        } />
        <Route path="/dashboard/minutes" element={
          <Layout>
            <Minutes /> {/* Add the Minutes component here */}
          </Layout>
        } />
        <Route path="/dashboard/meeting" element={
          <Layout>
            <Meeting />
          </Layout>
        } />
        <Route path="/dashboard/compose" element={
          <Layout>
            <ComposeEmail />
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;