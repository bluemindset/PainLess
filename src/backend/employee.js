import { Contributions } from "./utils";
import { Deductions } from "./utils";




export class Employee {
    constructor(id, name, role, bonus = 0.0, iban, basicSalary = 1500, workedHours = 0.0, normalHours = 173.33, overtimeHours = 0.0, addressLine) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.bonus = bonus;
        this.iban = iban;
        this.addressLine = addressLine;
        this.basicSalary = basicSalary;
        this.normalHours = parseFloat(normalHours);
        this.overtimeHours = parseFloat(overtimeHours);
        this.workedHours = parseFloat(normalHours) + parseFloat(overtimeHours) * 1.5;
        this.contributions = new Contributions(this.getGrossPay());
        this.deductions = new Deductions(this.getGrossPay());
        this.finalSalary = parseFloat(this.getFinalNetPay()).toFixed(2);
    }

    getGrossPay() {
        return parseFloat(this.basicSalary) * (parseFloat(this.workedHours) / parseFloat(this.normalHours));
    }

    getDeductions() {
        return parseFloat(this.deductions.getTotal());
    }

    getNetPay() {
        return parseFloat(this.getGrossPay()) - parseFloat(this.getDeductions());
    }

    getFinalNetPay() {
        return parseFloat(this.getNetPay()) + parseFloat(this.bonus);
    }
    //      total: emp.rate * (parseFloat(emp.workedHours) + parseFloat(emp.overtime || 0)),
    totalEmployerExpense() {
        return parseFloat(this.contributions.getTotal()) + parseFloat(this.getGrossPay())
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            role: this.role,
            rate: this.rate,
            iban: this.iban,
            basicSalary: this.basicSalary,
            workedHours: this.workedHours,
            normalHours: this.normalHours,
            overtimeHours: this.overtimeHours,
            grossPay: this.getGrossPay(),
            deductions: this.getDeductions(),
            netPay: this.getNetPay(),
            bonus: this.bonus,
            addressLine: this.addressLine,
            totalEmployerExpense: this.totalEmployerExpense()
        };
    }
}


export function toEmployee(obj) {
    return new Employee(
        obj.id,
        obj.name,
        obj.role,
        obj.bonus,
        obj.iban,
        obj.basicSalary,
        obj.workedHours,
        obj.normalHours,
        obj.overtimeHours,
        obj.addressLine,
    );
}
