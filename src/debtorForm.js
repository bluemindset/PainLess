import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid2';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs'; // Import dayjs

const DebtorForm = ({ details, setDetails, employees }) => {

    const handleChange = (event) => {
        setDetails({ ...details, [event.target.name]: event.target.value });
    };

    const handleDateChange = (date) => {
        setDetails({ ...details, executionDate: date });
    };

    function getSum(total, num) {
        return total + num;
    }
    console.log(employees)
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Total Amount"
                        name="totalAmount"
                        value={details.totalAmount}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Company Name"
                        name="companyName"
                        value={details.companyName}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Company ID"
                        name="companyID"
                        value={details.companyID}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>

                    <DatePicker
                        label="Execution Date"

                        defaultValue={dayjs('2022-07-17')}
                        value={dayjs(details.executionDate)} // Key change here
                        onChange={handleDateChange}
                    />
                    {/* <DatePicker
                        renderInput={(params) => <TextField fullWidth {...params} />}
                    /> */}
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Debtor Name"
                        name="debtorName"
                        value={details.debtorName}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Debtor Country"
                        name="debtorCountry"
                        value={details.debtorCountry}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Debtor BIC"
                        name="debtorBIC"
                        value={details.debtorBIC}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Debtor IBAN"
                        name="debtorIBAN"
                        value={details.debtorIBAN}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Currency"
                        name="currency"
                        value={details.currency}
                        onChange={handleChange}
                    />
                </Grid>
            </Grid>
        </LocalizationProvider>
    );
};

export default DebtorForm;