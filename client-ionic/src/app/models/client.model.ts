export class Client {

    Name: string = null;
    Address: string = null;
    Phone: string = null;
    Email: string = null;
    ContactPerson: string = null;
    Description: string = null;
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
