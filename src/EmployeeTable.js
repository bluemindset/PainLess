import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Button,
  Alert,
  InputLabel
} from "@mui/material";

import Grid from '@mui/material/Grid2';
import { Employee } from './backend/employee.js';
import { useNavigate } from "react-router-dom";
import CheckIcon from '@mui/icons-material/Check';
import DownloadXML from "./download.js";
import DebtorForm from "./debtorForm.js";

const API_URL = process.env.REACT_APP_BASE_URL;
const EMPLOYEES_URL = process.env.REACT_APP_EMPLOYEES_URL;


function EmployeeTable() {
  const [employees, setEmployees] = useState([]);
  const [details, setDetails] = useState({
    totalAmount: "",
    companyName: "",
    companyID: "",
    executionDate: "",
    debtorName: "",
    debtorCountry: "",
    debtorBIC: "",
    debtorIBAN: "",
    currency: "",
  });
  const [remittanceInfo, setRemittanceInfo] = useState('')
  const navigate = useNavigate();
  const [showSaveAlert, setShowSaveAlert] = useState(false);

  useEffect(() => {
    fetch(EMPLOYEES_URL)
      .then((response) => response.json())
      .then((data) => {
        const employeeObjects = data.employees.map(
          (emp) => new Employee(emp.id, emp.name, emp.role, emp.bonus, emp.iban, emp.basicSalary, emp.workedHours, emp.normalHours, emp.overtimeHours, emp.addressLine)
        );
        setEmployees(employeeObjects);
        setDetails(data.details)
        setRemittanceInfo(data.remittanceInfo)
      })
      .catch((error) => console.error("Error loading JSON data:", error));
  }, []);


  const handleEmployeesChange = (index, field, value) => {
    const updatedEmployees = [...employees];
    updatedEmployees[index][field] = value;
    setEmployees(updatedEmployees);
  };

  const handleDetailsChange = (field, value) => {
    setDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  const handleSave = () => {
    const employeesData = employees.map((emp) => ({
      ...emp,
    }));
    fetch(EMPLOYEES_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employees: employeesData,
        remittanceInfo: remittanceInfo,
        details: details
      }),
    })
      .then((response) => response.json())
      .then(
        handleShow()
      )
      .catch((error) => console.error("Error saving data:", error));
  }

  const goToPayslip = (indexparam) => {
    navigate("/payslip", { state: { employee: employees[indexparam], index: indexparam } });
  };


  const handleShow = () => {
    setShowSaveAlert(true)
    setTimeout(() => {
      setShowSaveAlert(false)
    }, 2000);
  }

  function SaveAlert() {
    return (
      <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
        The state of the payslips has been successfully saved.
      </Alert>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Employee Hours Tracker
      </Typography>
      <TableContainer component={Paper}>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              {/* <TableCell><strong>Role</strong></TableCell> */}
              <TableCell><strong>Basic Salary (€)</strong></TableCell>
              <TableCell><strong>Bonus (€)</strong></TableCell>
              <TableCell><strong>Normal Hours</strong></TableCell>
              <TableCell><strong>Overtime Hours</strong></TableCell>
              <TableCell><strong>IBAN</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee, index) => (
              <TableRow key={employee.id}>
                <TableCell>
                  <TextField
                    type="text"
                    style={{ width: 250 }}
                    value={employee.name}
                    onChange={(e) => handleEmployeesChange(index, "name", e.target.value)}
                    inputProps={{ style: { fontSize: 14 } }} // font size of input text
                  />
                </TableCell>

                <TableCell>
                  <TextField
                    type="number"
                    style={{ width: 150 }}
                    value={employee.basicSalary}
                    onChange={(e) => handleEmployeesChange(index, "basicSalary", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    style={{ width: 100 }}
                    value={employee.bonus}
                    onChange={(e) => handleEmployeesChange(index, "bonus", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    style={{ width: 100 }}
                    value={employee.normalHours}
                    onChange={(e) => handleEmployeesChange(index, "normalHours", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    style={{ width: 100 }}
                    value={employee.overtimeHours}
                    onChange={(e) => handleEmployeesChange(index, "overtimeHours", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    style={{ width: 230 }}
                    inputProps={{ style: { fontSize: 12 } }} // font size of input text
                    value={employee.iban}
                    onChange={(e) => handleEmployeesChange(index, "iban", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Button onClick={() => goToPayslip(index)}>Payslip</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>

      <Grid container spacing={2} sx={{ m: 2 }}>
        <InputLabel sx={{ marginBottom: 1, fontWeight: 500 }}>Debtor Details</InputLabel>
        <DebtorForm details={details} setDetails={setDetails} employees={employees} />
        <Grid size={12}>
          <InputLabel sx={{ marginBottom: 1, fontWeight: 500 }}>Remittance Details </InputLabel>
          <TextField
            fullWidth
            value={remittanceInfo}
            onChange={(e) => setRemittanceInfo(e.target.value)}
            placeholder="Enter details"
            variant="outlined"
            size="medium"
            multiline
            rows={4}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
                backgroundColor: '#fff',
                '&:hover fieldset': {
                  borderColor: '#2196f3',
                },
              }
            }}
          />
        </Grid>
        <Grid size={12}>
          {showSaveAlert && SaveAlert()}
        </Grid>
        <Grid size={12}>
          <Button variant="contained" onClick={handleSave}>Save State</Button>
        </Grid>
        <Grid size={12}>
          <DownloadXML />
        </Grid>
      </Grid>
    </Container >
  );
}

export default EmployeeTable;
