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
} from "@mui/material";
import React from "react";


function DownloadXML() {
    const handleDownload = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/generate');

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Get the XML content
            const xmlContent = await response.text();

            // Create a blob and download link
            const blob = new Blob([xmlContent], { type: 'application/xml' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'employees.xml';
            document.body.appendChild(a);
            a.click();

            // Cleanup
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading XML:', error);
            // Handle error appropriately (e.g., show error message to user)
        }
    };

    return (

        <Button variant="contained" style={{ backgroundColor: "green" }} onClick={handleDownload}>Generate XML</Button>

    );
}

export default DownloadXML;