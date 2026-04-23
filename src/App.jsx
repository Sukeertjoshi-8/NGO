import { BrowserRouter, Routes, Route } from 'react-router-dom';
import KavachShell from './KavachShell';
import DisasterReportForm from './DisasterReportForm';
import AdminDashboard from './AdminDashboard';
import CommandInsights from './CommandInsights';
import VolunteerPortal from './VolunteerPortal';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<KavachShell />} />
        <Route 
          path="/report" 
          element={<DisasterReportForm onBack={() => window.location.href = '/'} />} 
        />
        <Route 
          path="/dashboard" 
          element={<AdminDashboard goBack={() => window.location.href = '/'} />} 
        />
        <Route 
          path="/insights" 
          element={<CommandInsights goBack={() => window.location.href = '/'} />} 
        />
        <Route 
          path="/volunteer" 
          element={<VolunteerPortal goBack={() => window.location.href = '/'} />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
