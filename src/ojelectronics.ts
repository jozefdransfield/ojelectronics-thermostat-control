import {Session} from "./session";
import {SignInResponse} from "./types";

export class OJElectronics {
    private readonly apiKey: string;
    private readonly customerId: number;

    constructor(apiKey: string, customerId: number) {
        this.apiKey = apiKey;
        this.customerId = customerId;
    }

    async session(username: string, password: string): Promise<Session> {
        const response = await fetch('https://owd5-OJ001-app.ojelectronics.com/api/UserProfile/SignIn', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'APIKEY': this.apiKey,
                'ClientSWVersion': 1,
                'CustomerId': this.customerId,
                'UserName': username,
                'Password': password,
            }),
        });

        if (response.status !== 200) {
            throw new Error('Create Session Failed with ' + response.status + ' ' + response.statusText);
        }

        const json = await response.json() as SignInResponse;

        if (json.ErrorCode !== 0) {
            throw new Error('Create Session Failed to authenticate');
        }

        return new Session(this.apiKey, json.SessionId);
    }
}