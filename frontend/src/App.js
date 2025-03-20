import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/login';
import Dashboard from './Pages/dashboard';
import Schedule from './Pages/schedule';
import { Minutes } from './Pages/minutes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/schedule" element={<Schedule/>}/>
        <Route path="/dashboard/minutes" element={<Minutes/>}/>
      </Routes>
    </Router>
  );
}

export default App;
