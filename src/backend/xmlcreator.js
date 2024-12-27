const fs = require('fs');
const { create } = require("xmlbuilder2");

async function generateXML(dataPath, req, res) {
    try {
        const data = await fs.promises.readFile(dataPath, "utf8");
        const parsedData = JSON.parse(data);

        if (!parsedData.details || !parsedData.employees || !Array.isArray(parsedData.employees)) {
            throw new Error("Invalid parsedData structure.");
        }

        const doc = create({ version: "1.0", encoding: "UTF-8" })
            .ele("Document", {
                xmlns: "urn:iso:std:iso:20022:tech:xsd:pain.001.001.09",
                "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
            })
            .ele("CstmrCdtTrfInitn");

        // Group Header
        const grpHdr = doc.ele("GrpHdr");
        grpHdr.ele("MsgId").txt(parsedData.details.messageId || "default-message-id");
        grpHdr.ele("CreDtTm").txt(new Date().toISOString());
        grpHdr.ele("NbOfTxs").txt(parsedData.employees.length.toString());
        grpHdr.ele("CtrlSum").txt(parsedData.details.totalAmount.toString());

        const initgPty = grpHdr.ele("InitgPty");
        initgPty.ele("Nm").txt(parsedData.details.companyName);
        const id = initgPty.ele("Id").ele("OrgId").ele("Othr");
        id.ele("Id").txt(parsedData.details.companyID);

        // Payment Information



        const pmtInf = doc.ele("PmtInf");
        pmtInf.ele("PmtInfId").txt("PmtInfId");
        pmtInf.ele("PmtMtd").txt("TRF");
        pmtInf.ele("BtchBookg").txt("1");
        pmtInf.ele("NbOfTxs").txt(parsedData.employees.length.toString());
        pmtInf.ele("CtrlSum").txt(parsedData.details.totalAmount.toString());

        const pmtTpInf = pmtInf.ele("PmtTpInf");
        pmtTpInf.ele("SvcLvl").ele("Cd").txt("SEPA");



        // const pmtInf = doc.ele("PmtInf");
        // pmtInf.ele("PmtInfId").txt("PmtInfId");
        // pmtInf.ele("PmtMtd").txt("TRF");
        // pmtInf.ele("BtchBookg").txt("1");
        // const pmtTpInf = pmtInf.ele("PmtTpInf");
        // pmtTpInf.ele("SvcLvl").ele("Cd").txt("SEPA");
        pmtInf.ele("ReqdExctnDt").ele("Dt").txt(parsedData.details.executionDate.split("T")[0]);


        const dbtr = pmtInf.ele("Dbtr");
        dbtr.ele("Nm").txt(parsedData.details.debtorName || "Default Debtor Name");

        const dbtrAcct = pmtInf.ele("DbtrAcct");
        dbtrAcct.ele("Id").ele("IBAN").txt(parsedData.details.debtorIBAN);
        dbtrAcct.ele("Ccy").txt(parsedData.details.currency);

        const dbtrAgt = pmtInf.ele("DbtrAgt").ele("FinInstnId");
        dbtrAgt.ele("BICFI").txt(parsedData.details.debtorBIC || "DEFAULTBIC");

        pmtInf.ele("ChrgBr").txt("SLEV");

        // Credit Transfer Transaction Information
        parsedData.employees.forEach((employee, index) => {
            const cdtTrfTxInf = pmtInf.ele("CdtTrfTxInf");

            const pmtId = cdtTrfTxInf.ele("PmtId");
            pmtId.ele("InstrId").txt(`InstrID_${index + 1}`);
            pmtId.ele("EndToEndId").txt(employee.endToEndId || `E2E_${index + 1}`);


            const empPmtTpInf = cdtTrfTxInf.ele("PmtTpInf");
            empPmtTpInf.ele("SvcLvl").ele("Cd").txt("SEPA");
            empPmtTpInf.ele("CtgyPurp").ele("Cd").txt("SALA");

            cdtTrfTxInf.ele("Amt").ele("InstdAmt", { Ccy: "EUR" }).txt(employee.finalSalary);

            cdtTrfTxInf.ele("ChrgBr").txt("SLEV");

            const cdtr = cdtTrfTxInf.ele("Cdtr");
            cdtr.ele("Nm").txt(employee.name);


            const cdtrAdr = cdtr.ele("PstlAdr");
            cdtrAdr.ele("Ctry").txt("CY");


            // employee.addressLines.forEach(line => {
            //     cdtrAdr.ele("AdrLine").txt(line);
            // });
            cdtrAdr.ele("AdrLine").txt(employee.addressLine);

            const cdtrAcct = cdtTrfTxInf.ele("CdtrAcct");
            cdtrAcct.ele("Id").ele("IBAN").txt(employee.iban);

            const rmtInf = cdtTrfTxInf.ele("RmtInf").ele("Strd");
            rmtInf.ele("AddtlRmtInf").txt(employee.remittanceInfo || "No details provided");
        });

        const xmlString = doc.end({ prettyPrint: true });
        fs.writeFileSync("payment.xml", xmlString, "utf8");
        res.setHeader('Content-Type', 'application/xml');
        res.setHeader('Content-Disposition', 'attachment; filename=pain001.xml');
        res.status(200).send(xmlString);
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).send("Error generating XML: " + err.message);
    }
}

module.exports = { generateXML };
