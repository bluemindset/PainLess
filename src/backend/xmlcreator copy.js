const fs = require('fs'); // or `import * as fs from 'fs'` if you're using ES2015+
const { create } = require("xmlbuilder2");

async function readEmployees(dataPath) {
    try {
        const data = await fs.promises.readFile(dataPath, "utf8");
        const json = JSON.parse(data);
        return json;
    } catch (err) {
        throw new Error("Failed to read data");
    }
}

async function generateXML(dataPath, req, res) {

    try {
        parsedData = await readEmployees(dataPath);

        if (!parsedData.details || !parsedData.employees || !Array.isArray(parsedData.employees)) {
            throw new Error("Invalid parsedData structure.");
        }

        const doc = create({ version: "1.0", encoding: "UTF-8" })
            .ele("Document", {
                xmlns: "urn:iso:std:iso:20022:tech:xsd:pain.001.001.09",
                "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
            })
            .ele("CstmrCdtTrfInitn");

        const grpHdr = doc.ele("GrpHdr");
        grpHdr.ele("MsgId").txt("MessageID");
        grpHdr.ele("CreDtTm").txt(new Date().toISOString().split("T")[0]);

        grpHdr.ele("NbOfTxs").txt(parsedData.employees.length.toString());
        grpHdr.ele("CtrlSum").txt(parsedData.details.totalAmount.toString());

        const initgPty = grpHdr.ele("InitgPty");
        initgPty.ele("Nm").txt(parsedData.details.companyName);
        const id = initgPty.ele("Id").ele("OrgId").ele("Othr");
        id.ele("Id").txt(parsedData.details.companyID);

        const pmtInf = doc.ele("PmtInf");
        pmtInf.ele("PmtInfId").txt("PmtInfId");
        pmtInf.ele("PmtMtd").txt("TRF");
        pmtInf.ele("BtchBookg").txt("1");
        const pmtTpInf = pmtInf.ele("PmtTpInf");
        pmtTpInf.ele("SvcLvl").ele("Cd").txt("SEPA");
        const executionDate = new Date(parsedData.details.executionDate).toISOString().split("T")[0];
        pmtInf.ele("ReqdExctnDt").txt(executionDate);

        const dbtr = pmtInf.ele("Dbtr");
        dbtr.ele("Nm").txt(parsedData.details.debtorName);
        dbtr.ele("PstlAdr").ele("Ctry").txt(parsedData.details.debtorCountry);
        const dbtrId = dbtr.ele("Id").ele("OrgId");
        dbtrId.ele("BICOrBEI").txt(parsedData.details.debtorBIC);
        const dbtrAcct = pmtInf.ele("DbtrAcct");
        dbtrAcct.ele("Id").ele("IBAN").txt(parsedData.details.debtorIBAN);
        dbtrAcct.ele("Ccy").txt(parsedData.details.currency);
        pmtInf.ele("DbtrAgt").ele("FinInstnId").ele("BIC").txt(parsedData.details.debtorBIC);
        pmtInf.ele("ChrgBr").txt("SLEV");

        parsedData.employees.forEach((emp, index) => {
            console.log(emp)
            const cdtTrfTxInf = pmtInf.ele("CdtTrfTxInf");
            const pmtId = cdtTrfTxInf.ele("PmtId");
            pmtId.ele("InstrId").txt(`InstrID_${index + 1}`);
            pmtId.ele("EndToEndId").txt(emp.endToEndId);
            const empPmtTpInf = cdtTrfTxInf.ele("PmtTpInf");
            empPmtTpInf.ele("SvcLvl").ele("Cd").txt("SEPA");
            empPmtTpInf.ele("CtgyPurp").ele("Cd").txt("SALA");
            cdtTrfTxInf.ele("Amt").ele("InstdAmt", { Ccy: "EUR" }).txt(emp.finalSalary);
            cdtTrfTxInf.ele("ChrgBr").txt("SLEV");
            const cdtr = cdtTrfTxInf.ele("Cdtr");
            cdtr.ele("Nm").txt(emp.name);
            const cdtrAdr = cdtr.ele("PstlAdr");
            cdtrAdr.ele("Ctry").txt(emp.country);
            cdtrAdr.ele("AdrLine").txt(emp.addressLine);
            const cdtrAcct = cdtTrfTxInf.ele("CdtrAcct");
            cdtrAcct.ele("Id").ele("IBAN").txt(emp.iban);
            cdtTrfTxInf.ele("RmtInf").ele("Ustrd").txt(parsedData.remittanceInfo);
        });
        const xmlString = doc.end({ prettyPrint: true });
        fs.writeFileSync("payment.xml", xmlString, "utf8");
        res.setHeader('Content-Type', 'application/xml');
        res.setHeader('Content-Disposition', 'attachment; filename=employees.xml');
        res.status(200).send(xmlString);

    } catch (err) {
        console.log("error", err.message)
        res.status(500).send("Error generating XML: " + err.message);
    }

}

module.exports = { generateXML };
