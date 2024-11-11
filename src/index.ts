export class API {
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

class Session {
    private readonly created: number;
    private readonly apiKey: string;
    private readonly sessionId: string;

    constructor(apiKey: string, sessionId: string) {
        this.created = (new Date()).getMilliseconds();
        this.apiKey = apiKey;
        this.sessionId = sessionId;
    }

    age(): number {
        return (new Date()).getMilliseconds() - this.created;
    }

    async groupContents(): Promise<GroupContent[]> {
        const params = new URLSearchParams();
        params.append('sessionid', this.sessionId);
        params.append('apiKey', this.apiKey);

        const response = await fetch('https://owd5-OJ001-app.ojelectronics.com/api/Group/GroupContents?' + params.toString());

        // TODO: Check the status response

        const json = await response.json() as GroupContentsResponse;

        return json.GroupContents;
    }
}

type SignInResponse = {
    SessionId: string;
    ErrorCode: number;
}

type GroupContentsResponse = {
    GroupContents: GroupContent[];
    ErrorCode: number;
}

type GroupContent = {
    Action: number,
    GroupId: number,
    GroupName: string,
    RegulationMode: number,
    ComfortSetpoint: number,
    ComfortEndTime: string,
    ManualModeSetpoint: number,
    VacationEnabled: boolean,
    VacationBeginDay: string,
    VacationEndDay: string,
    VacationTemperature: number,
    LastPrimaryModeIsAuto: boolean,
    BoostEndTime: string
    FrostProtectionTemperature: number
}