import {addHours, formatRFC3339} from "date-fns";

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

export class Session {
    private readonly apiKey: string;
    private readonly sessionId: string;

    constructor(apiKey: string, sessionId: string) {
        this.apiKey = apiKey;
        this.sessionId = sessionId;
    }

    async groups(): Promise<Group[]> {
        const params = new URLSearchParams();
        params.append('sessionid', this.sessionId);
        params.append('apiKey', this.apiKey);

        const response = await fetch('https://owd5-OJ001-app.ojelectronics.com/api/Group/GroupContents?' + params.toString());

        // TODO: Check the status response

        const json = await response.json() as GroupContentsResponse;

        console.log(json)

        return json.GroupContents.map(groupContent => new Group(this.apiKey, this.sessionId, groupContent));
    }
}

export class Group {
    private readonly apiKey: string;
    private readonly sessionId: string;
    private groupContents: GroupContent;

    get id(): number {
        return this.groupContents.GroupId;
    }

    get name(): string {
        return this.groupContents.GroupName;
    }

    get thermostats(): Thermostat[] {
        return this.groupContents.Thermostats.map((it) => {
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
        let updateGroupContentRequest = {
            APIKEY: this.apiKey,
            SetGroup: {
                GroupId: this.groupContents.GroupId,
                RegulationMode: RegulationMode.Eco,
            }
        }
        await this.postUpdate(updateGroupContentRequest);
    }

    async resumeSchedule() {
        let updateGroupContentRequest = {
            APIKEY: this.apiKey,
            SetGroup: {
                GroupId: this.groupContents.GroupId,
                RegulationMode: RegulationMode.Schedule
            }
        }
        await this.postUpdate(updateGroupContentRequest);
    }

    async manualMode(targetTemperature: Temperature) {
        let updateGroupContentRequest = {
            APIKEY: this.apiKey,
            SetGroup: {
                GroupId: this.groupContents.GroupId,
                RegulationMode: RegulationMode.Manual,
                ManualModeSetpoint: targetTemperature.value * 100
            }
        }
        await this.postUpdate(updateGroupContentRequest);
    }

    async comfortMode(targetTemperature: Temperature, targetEndTime: Date) {
        let updateGroupContentRequest = {
            APIKEY: this.apiKey,
            SetGroup: {
                GroupId: this.groupContents.GroupId,
                RegulationMode: RegulationMode.Comfort,
                ComfortSetpoint: targetTemperature.value * 100,
                ComfortEndTime: formatRFC3339(targetEndTime),
            }
        }
        await this.postUpdate(updateGroupContentRequest);
    }

    async boostMode() {
        let updateGroupContentRequest = {
            APIKEY: this.apiKey,
            SetGroup: {
                BoostEndTime: formatRFC3339(addHours(new Date(), 1)),
                GroupId: this.groupContents.GroupId,
                RegulationMode: RegulationMode.Boost,
            }
        }
        await this.postUpdate(updateGroupContentRequest);
    }

    private async postUpdate(updateGroupContentRequest: any) {
        const params = new URLSearchParams();
        params.append('sessionid', this.sessionId);

        const response = await fetch('https://owd5-OJ001-app.ojelectronics.com/api/Group/UpdateGroup?' + params.toString(),
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(updateGroupContentRequest)
            });

        const json = await response.json();

        console.log(json)

        if (json.ErrorCode !== 0) {
            throw new Error('Failed to update group');
        }
    }
}


export type Thermostat = {
    name: string;
    floorTemperature: number
    roomTemperature: number
    heating: boolean
    serialNumber: string
}

export class Temperature {
    readonly value: number;

    private constructor(temperature: number) {
        this.value = temperature;
    }

    static ofCelsius(celsius: number): Temperature {
        return new Temperature(celsius);
    }

    static ofFahrenheit(fahrenheit: number): Temperature {
        return new Temperature((fahrenheit - 32) * 5 / 9);
    }

    static ofKelvin(kelvin: number): Temperature {
        return new Temperature(kelvin - 273.15);
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

enum RegulationMode {
    Schedule = 1,
    Comfort = 2,
    Manual = 3,
    Boost = 8,
    Eco = 9
}