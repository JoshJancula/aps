export class Franchise {

    Name: string = null;
    Phone: string = null;
    Email: string = null;
    Address: string = null;
    TaxRate: string = null;
    Active: boolean = true;
    id: number = null;

    constructor(values?: any) {
        if (values) {
            Object.keys(values).forEach(key => {
                this[key] = values[key];
            });
        }
    }
}
