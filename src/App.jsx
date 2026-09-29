import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login, Register, Dashboard, Medicines, MedicineDetail, NewMedicine, EditMedicine } from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/medicines" element={<Medicines />} />
        <Route path="/medicines/:id" element={<MedicineDetail />} />
        <Route path="/medicines/:id/edit" element={<EditMedicine />} />
        <Route path="/medicines/new" element={<NewMedicine />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;