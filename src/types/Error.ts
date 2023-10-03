export default class ErrorService {
    message: string
    data: any
    status: number

    constructor(message: string, data: any, status: number) {
        this.data = data;
        this.message = message;
        this.status = status;
    }
}