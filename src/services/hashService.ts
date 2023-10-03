import {
    createHash
} from "crypto"

export default class HashService {
    public async hashData(data: string): Promise<string> {
        const hashObject = createHash("sha256");
        hashObject.update(data);
        const hash = hashObject.digest("hex");
        return hash;
    }

}