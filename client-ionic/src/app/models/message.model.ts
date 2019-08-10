export class Message {

    Author: string = null;
    AuthorId: number = null;
    Recipient: string = null;
    RecipientId: number = null;
    RecipientDelete: boolean = false;
    AuthorDelete: boolean = false;
    Content: string = null;
    MessageType: string = null;
    Read: boolean = false;
    id: number = null;

    constructor(values?: any) {
        if (values) {
            Object.keys(values).forEach(key => {
                this[key] = values[key];
            });
        }
    }
}
