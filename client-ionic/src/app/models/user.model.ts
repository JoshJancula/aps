export class User {

    Username: string = null;
    FirstName: string = null;
    LastName: string = null;
    Role: string = null;
    Password: string = null;
    Email: string = null;
    Phone: string = null;
    Avatar: string = null;
    FranchiseId: number = null;
    Active: boolean = true;
    RequireTimesheet: boolean = false;
    id: number = null;

    constructor(values?: any) {
        if (values) {
            Object.keys(values).forEach(key => {
                this[key] = values[key];
            });
        }
    }
}
