

export class Contributions {

    constructor(amount) {
        this.amount = amount
    }
    getSocialInsurance() {

        return this.amount * 0.083

    }

    getNhs() {
        return this.amount * 0.029

    }


    getCohessionFund() {
        return this.amount * 0.02

    }

    getRedundancyFund() {

        return this.amount * 0.012

    }

    getIndustrialTraining() {

        return this.amount * 0.005

    }

    getTotal() {
        return this.getIndustrialTraining() +
            this.getNhs() +
            this.getCohessionFund() +
            this.getRedundancyFund() +
            this.getSocialInsurance();

    }

}

export class Deductions {
    constructor(amount) {
        this.amount = amount
    }
    getSocialInsurance() {

        return this.amount * 0.083

    }

    getNhs() {
        return this.amount * 0.0265

    }

    getTotal() {
        return this.getNhs() + this.getSocialInsurance()
    }

}