export class Invoice {

    Employee: string = null;
    EmployeeId: number = null;
    Stripes: any = null;
    Tint: any = null;
    PPF: any = null;
    OtherServices: any = null;
    CustomPinstripe: any = null;
    Client: string = null;
    Total: number = 0;
    Paid: any = null;
    PaymentMethod: string = null;
    PO: string = null;
    CheckNumber: string = null;
    RO: string = null;
    VIN: string = null;
    Stock: any = null;
    Description: string = null;
    VehicleDescription: string = null;
    CalcTax: boolean = false;
    Comments: string = null;
    Vehicle: string = null;
    EditedBy: any = null;
    FranchiseId: number = null;
    id: number = null;

    constructor(values?: any) {
        if (values) {
            Object.keys(values).forEach(key => {
                this[key] = values[key];
            });
        }
    }
}
