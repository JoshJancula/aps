export class Appointment {

    Date: string = null;
    Time: string = null;
    Client: string = null;
    Location: string = null;
    ContactPerson: string = null;
    ContactPersonPhone: string = null;
    ScheduledBy: string = null;
    ScheduledById: string = null;
    AssignedEmployee: string = null;
    AssignedEmployeeId: number = null;
    Comments: string = null;
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
