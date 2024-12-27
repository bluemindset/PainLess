import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EmployeeTable from "./EmployeeTable";
import Payslip from "./Payslip";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EmployeeTable />} />
        <Route path="/payslip" element={<Payslip />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;