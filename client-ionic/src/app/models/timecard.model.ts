export class Timecard {

    EmployeeName: string = null;
    EmployeeId: number = null;
    FranchiseId: number = null;
    Date: string = null;
    TimeIn: string = null;
    TimeOut: string = null;
    id: number = null;

    constructor(values?: any) {
        if (values) {
            Object.keys(values).forEach(key => {
                this[key] = values[key];
            });
        }
    }
}
