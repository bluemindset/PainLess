import React, { useState } from "react";
import {
    Box,
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper,
    Button,
    TextField,
    InputLabel
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import Grid from '@mui/material/Grid2';
import { Employee, toEmployee } from './backend/employee.js';

const Payslip = () => {

    const navigate = useNavigate();
    const { state } = useLocation();
    //    var employee = toEmployee(state.employee);
    const [employee, setEmployee] = React.useState(toEmployee(state.employee));
    const empIndex = state.index
    const updateAddressLine = (newAddress) => {
        setEmployee((prevEmployee) => {
            console.log(newAddress)
            const updatedEmployee = toEmployee({
                ...prevEmployee,
                addressLine: newAddress
            });
            return updatedEmployee;
        });
    };

    const updateIBAN = (newIBAN) => {
        setEmployee((prevEmployee) => {
            const updatedEmployee = toEmployee({
                ...prevEmployee,
                iban: newIBAN
            });
            return updatedEmployee;
        });
    };

    const handleSave = (index) => {
        const EMPLOYEES_URL = process.env.REACT_APP_EMPLOYEE_URL;
        console.log(employee)
        fetch(EMPLOYEES_URL + index, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                employee: employee,
            }),
        })
            .then((response) => response.json())
            .catch((error) => console.error("Error saving data:", error));
    }



    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom align="center">
                Employee Payslip
            </Typography>
            <Button sx={{ m: 2 }} variant="contained" color="primary" onClick={() => { handleSave(empIndex); navigate('/', { state: { employee } }) }}>
                Save & Back    </Button>
            <Grid container spacing={2}>
                {/* Earnings Section */}
                <Grid item xs={12} sm={4}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Earnings
                        </Typography>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Basic Salary</TableCell>
                                    <TableCell sx={{ bgcolor: "yellow" }}>
                                        €{employee.basicSalary}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Normal Hours</TableCell>
                                    <TableCell sx={{ bgcolor: "yellow" }}>
                                        {employee.normalHours}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Overtime Hours</TableCell>
                                    <TableCell>{employee.overtimeHours}</TableCell>
                                </TableRow>
                                <TableRow >
                                    <TableCell>Worked Hours</TableCell>
                                    <TableCell style={{ color: "red" }} >{employee.workedHours}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        <strong>Total Gross</strong>
                                    </TableCell>
                                    <TableCell>
                                        <strong>€{employee.getGrossPay()}</strong>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>

                {/* Deductions Section */}
                <Grid item xs={12} sm={4}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Deductions
                        </Typography>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Social Insurance</TableCell>
                                    <TableCell>  €{employee.deductions.getSocialInsurance().toFixed(2)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>National Health</TableCell>
                                    <TableCell>€{employee.deductions.getNhs().toFixed(2)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        <strong>Total</strong>
                                    </TableCell>
                                    <TableCell>
                                        <strong>€{
                                            (() => {
                                                const total = employee.getDeductions();
                                                return total.toFixed(2);
                                            })()}</strong>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>

                {/* Contributions Section */}
                <Grid item xs={12} sm={4}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Contributions
                        </Typography>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Social Insurance</TableCell>
                                    <TableCell>€{employee.contributions.getSocialInsurance().toFixed(2)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>National Health</TableCell>
                                    <TableCell>€{employee.contributions.getNhs().toFixed(2)}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>Cohession Fund</TableCell>
                                    <TableCell>€{employee.contributions.getCohessionFund().toFixed(2)}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>Redundancy Fund</TableCell>
                                    <TableCell>€{employee.contributions.getRedundancyFund().toFixed(2)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Industrial Training</TableCell>
                                    <TableCell>€{employee.contributions.getIndustrialTraining().toFixed(2)}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        <strong>Total</strong>
                                    </TableCell>
                                    <TableCell>
                                        <strong>€{employee.contributions.getTotal().toFixed(2)}</strong>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
            </Grid>

            <InputLabel>Enter Address</InputLabel>
            <TextField
                fullWidth
                value={employee.addressLine}
                onChange={(e) => updateAddressLine(e.target.value)}
                placeholder="Enter address"
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
            <InputLabel>Enter IBAN</InputLabel>
            <TextField
                fullWidth
                value={employee.iban}
                onChange={(e) => updateIBAN(e.target.value)}
                placeholder="Enter address"
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

            {/* Summary Section */}
            <Box mt={3} p={2} component={Paper} elevation={3}>
                <Typography variant="h6" sx={{ mb: 2 }} align="left">
                    Summary
                </Typography>
                <Grid container spacing={2}>
                    <Grid size={3}>
                        <Typography>Net Pay:</Typography>
                    </Grid>
                    <Grid size={9}>
                        <Typography sx={{ color: "green" }}>
                            €{employee.getNetPay().toFixed(2)}
                        </Typography>
                    </Grid>
                    <Grid size={3}>
                        <Typography>Bonus:</Typography>
                    </Grid>
                    <Grid size={9}>
                        <Typography>€{employee.bonus}</Typography>
                    </Grid>

                    <Grid size={3}>
                        <Typography>Final Net Pay:</Typography>
                    </Grid>
                    <Grid size={9}>
                        <Typography sx={{ fontWeight: "bold", color: "green" }}>
                            €{employee.getFinalNetPay().toFixed(2)}</Typography>
                    </Grid>

                    <Grid size={3}>
                        <Typography>Total Employer Expense:</Typography>
                    </Grid>
                    <Grid size={9}>
                        <Typography sx={{ fontWeight: "bold", color: "red" }}>
                            €{employee.totalEmployerExpense().toFixed(2)}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </Container >
    );
};

export default Payslip;
