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

    async groups(): Promise<Group[]> {
        const params = new URLSearchParams();
        params.append('sessionid', this.sessionId);
        params.append('apiKey', this.apiKey);

        const response = await fetch('https://owd5-OJ001-app.ojelectronics.com/api/Group/GroupContents?' + params.toString());

        // TODO: Check the status response

        const json = await response.json() as GroupContentsResponse;

        return json.GroupContents.map(groupContent => new Group(this.apiKey, this.sessionId, groupContent));
    }
}

type Thermostat = {
    name: string;
    floorTemperature: number
    roomTemperature: number
    heating: boolean
    serialNumber: string
}

class Group {
    private readonly apiKey: string;
    private readonly sessionId: string;
    private groupContents: GroupContent;

    get name(): string {
        return this.groupContents.GroupName;
    }

    get thermostats(): Thermostat[] {
        return this.groupContents.Thermostats.map ( (it) => {
            return {
                name: it.ThermostatName,
                serialNumber: it.SerialNumber,
                floorTemperature: it.FloorTemperature / 100,
                roomTemperature: it.RoomTemperature / 100,
                heating: it.Heating
            }
        });
    }

    constructor(apiKey: string, sessionId: string, groupContents: GroupContent) {
        this.apiKey = apiKey;
        this.sessionId = sessionId;
        this.groupContents = groupContents;
    }

    async ecoMode() {
        let updateGroupContentRequest = this.newUpdateGroupContentRequest()
        updateGroupContentRequest.SetGroup.RegulationMode = 9;
        await this.postUpdate(updateGroupContentRequest);
    }

    async resumeSchedule() {
        let updateGroupContentRequest = this.newUpdateGroupContentRequest()
        updateGroupContentRequest.SetGroup.RegulationMode = 1;
        await this.postUpdate(updateGroupContentRequest);
    }

    async comfortMode() {
        throw new Error('Not implemented');
        // ComfortSetpoint: 1600, Target Temp
        // ComfortEndTime: "2024-11-12T10:33:00", Target end date.
    }

    async boostMode() {
        throw new Error('Not implemented');
        //   BoostEndTime: "2024-11-12T10:35:00", // Target end date Boost mode sets one hour!
    }

    private async postUpdate(updateGroupContentRequest: UpdateGroupContentRequest) {
        const params = new URLSearchParams();
        params.append('sessionid', this.sessionId);

        const response = await fetch('https://owd5-OJ001-app.ojelectronics.com/api/Group/UpdateGroup?' + params.toString(),
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(updateGroupContentRequest)
            });

        const json = await response.json();

        if (json.ErrorCode !== 0) {
            throw new Error('Failed to update group');
        }
    }

    private newUpdateGroupContentRequest(): UpdateGroupContentRequest {
        return {
            APIKEY: this.apiKey,
            SetGroup: {
                BoostEndTime: this.groupContents.BoostEndTime,
                ComfortEndTime: this.groupContents.ComfortEndTime,
                ComfortSetpoint: this.groupContents.ComfortSetpoint,
                ExcludeVacationData: false,
                GroupId: this.groupContents.GroupId,
                GroupName: this.groupContents.GroupName,
                LastPrimaryModeIsAuto: this.groupContents.LastPrimaryModeIsAuto,
                ManualModeSetpoint: this.groupContents.ManualModeSetpoint,
                RegulationMode: this.groupContents.RegulationMode,
                Schedule: this.groupContents.Schedule,
                VactionBeginDay: this.groupContents.VacationBeginDay,
                VacationEnabled: this.groupContents.VacationEnabled,
                VacationEndDay: this.groupContents.VacationEndDay,
                VacationTemperature: this.groupContents.VacationTemperature,
            }
        }
    }
}


type UpdateGroupContentRequest = {
    APIKEY: string,
    SetGroup: {
        BoostEndTime: string,
        ComfortEndTime: string,
        ComfortSetpoint: number,
        ExcludeVacationData: boolean,
        GroupId: number,
        GroupName: string,
        LastPrimaryModeIsAuto: boolean,
        ManualModeSetpoint: number,
        RegulationMode: number,
        Schedule: Schedule,
        VactionBeginDay: string,
        VacationEnabled: boolean,
        VacationEndDay: string,
        VacationTemperature: number,
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
    Thermostats: ThermostatResponse[]
    RegulationMode: number,
    Schedule: Schedule,
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

type Schedule = {
    Days: Day[],
    ModifiedDueToVerification: boolean
}

type Day = {
    WeekDayGrpNo: number,
    Events: Event[]
}

type Event = {
    ScheduleType: number,
    Clock: string,
    Temperature: number,
    Active: boolean,
    EventIsOnNextDay: boolean
}

type ThermostatResponse = {
    Id: number,
    Action: number,
    SerialNumber: string,
    GroupName: string,
    GroupId: number,
    CustomerId: number,
    SWversion: string,
    Online: boolean,
    Heating: boolean,
    RoomTemperature: number,
    FloorTemperature: number,
    RegulationMode: number,
    Schedule: Schedule,
    ComfortSetpoint: number,
    ComfortEndTime: string,
    ManualModeSetpoint: number,
    VacationEnabled: boolean,
    VacationBeginDay: string,
    VacationEndDay: string,
    VacationTemperature: number,
    LastPrimaryModeIsAuto: boolean,
    BoostEndTime: string
    FrostProtectionTemperature: number,
    ErrorCode: number,
    ThermostatName: string,
    OpenWindow: boolean,
    AdaptiveMode: boolean,
    DaylightSaving: boolean,
    SensorAppl: number,
    MinSetpoint: number,
    MaxSetpoint: number,
    TimeZone: number,
    DaylightSavingActive: boolean,
    FloorType: number,
}