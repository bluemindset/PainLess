const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 5000;
const { generateXML } = require("./xmlcreator");

const cors = require('cors');
app.use(cors());

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(express.json());

const dataPath = path.join(__dirname, "data", "employees.json");

app.get("/api/employees", (req, res) => {
    fs.readFile(dataPath, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to read data" });

        try {
            const parsedData = JSON.parse(data);
            const { employees, details, remittanceInfo } = parsedData;
            console.log('Data loaded:', { employees, details, remittanceInfo });
            res.json({ employees, details, remittanceInfo });
        } catch (parseErr) {
            res.status(500).json({ error: "Failed to parse data" });
        }
    });
});

app.post("/api/employees", (req, res) => {
    const { employees, details, remittanceInfo } = req.body;

    details.totalAmount = employees.reduce((acc, employee) => acc + parseFloat(employee.finalSalary || 0), 0).toFixed(2)

    if (!employees || !details) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    fs.writeFile(dataPath, JSON.stringify({ employees, details, remittanceInfo }, null, 2), "utf8", (err) => {
        if (err) return res.status(500).json({ error: "Failed to update data" });
        res.json({ message: "Data updated successfully" });
    });

});

app.post("/api/employee/:index", (req, res) => {
    const { index } = req.params; // Get index from the URL
    const { employee } = req.body; // Data for the update
    if (!employee || index === undefined) {
        return res.status(400).json({ error: "Missing required fields or index" });
    }

    // Read the existing data
    fs.readFile(dataPath, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to read data" });

        try {
            const parsedData = JSON.parse(data);

            // Check if the index is valid
            if (index < 0 || index >= parsedData.employees.length) {
                return res.status(400).json({ error: "Invalid employee index" });
            }
            // Update the employee at the specified index
            parsedData.employees[index] = {
                ...parsedData.employees[index],
                ...employee, // Update with the new data
            };
            // Write the updated data back to the file
            fs.writeFile(dataPath, JSON.stringify(parsedData, null, 2), "utf8", (err) => {
                if (err) return res.status(500).json({ error: "Failed to update data" });
                res.json({ message: "Employee updated successfully", data: parsedData });
            });
        } catch (parseErr) {
            return res.status(500).json({ error: "Failed to parse data" });
        }
    });
});

app.get("/api/generate", (req, res) => {
    console.log("h")
    generateXML(dataPath, req, res);
});


db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
