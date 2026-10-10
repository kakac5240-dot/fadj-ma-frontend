import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login, Register, VerifyOtp, Dashboard, Medicines, MedicineDetail, EditMedicine, NewMedicine } from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/medicines" element={<ProtectedRoute><Medicines /></ProtectedRoute>} />
        <Route path="/medicines/:id" element={<ProtectedRoute><MedicineDetail /></ProtectedRoute>} />
        <Route path="/medicines/:id/edit" element={<ProtectedRoute><EditMedicine /></ProtectedRoute>} />
        <Route path="/medicines/new" element={<ProtectedRoute><NewMedicine /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;