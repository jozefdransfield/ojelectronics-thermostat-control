import {addHours, formatRFC3339} from "date-fns";

export interface HttpClient {
    get<T>(url: string): Promise<T>

    postJson<T>(url: string, obj: any): Promise<T>
}

class FetchHttpClient implements HttpClient {
    private readonly baseUrl: String

    constructor(baseUrlL: String) {
        this.baseUrl = baseUrlL
    }

    async get<T>(url: string): Promise<T> {
        const response = await fetch(`${this.baseUrl}${url}`);
        if (response.status !== 200) {
            throw new Error(`Error response requesting ${url} ${response.status} ${response.statusText}`);
        }
        return response as T
    }

    async postJson<T>(url: string, obj: any): Promise<T> {
        const response = await fetch(`${this.baseUrl}${url}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(obj),
        });

        if (response.status !== 200) {
            throw new Error(`Error response requesting ${url} ${response.status} ${response.statusText}`);
        }

        return await response.json() as T;
    }
}

export class OJElectronics {
    private readonly apiKey: string;
    private readonly customerId: number;
    private readonly httpClient: HttpClient;

    constructor(apiKey: string, customerId: number, httpClient: HttpClient = new FetchHttpClient('https://owd5-OJ001-app.ojelectronics.com/api')) {
        this.apiKey = apiKey;
        this.customerId = customerId;
        this.httpClient = httpClient
    }

    async session(username: string, password: string): Promise<Session> {
        const json = await this.httpClient.postJson<SignInResponse>('/UserProfile/SignIn', {
            'APIKEY': this.apiKey,
            'ClientSWVersion': 1,
            'CustomerId': this.customerId,
            'UserName': username,
            'Password': password,
        });

        if (json.ErrorCode !== 0) {
            throw new Error('Create Session Failed to authenticate');
        }

        return new Session(this.apiKey, json.SessionId, this.httpClient);
    }
}

export class Session {
    private readonly apiKey: string;
    private readonly sessionId: string;
    private readonly httpClient: HttpClient;

    constructor(apiKey: string, sessionId: string, httpClient: HttpClient) {
        this.apiKey = apiKey;
        this.sessionId = sessionId;
        this.httpClient = httpClient
    }

    async groups(): Promise<Group[]> {
        const params = new URLSearchParams();
        params.append('sessionid', this.sessionId);
        params.append('apiKey', this.apiKey);

        const response = await this.httpClient.get<GroupContentsResponse>('Group/GroupContents?' + params.toString());

        if (response.ErrorCode !== 0) {
            throw new Error(`Failed to get groups, with error code ${response.ErrorCode}`)
        }

        return response.GroupContents.map(groupContent => new Group(this.apiKey, this.sessionId, this.httpClient, groupContent));
    }
}

export class Group {
    private readonly apiKey: string;
    private readonly sessionId: string;
    private readonly httpClient: HttpClient;
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
                heating: it.Heating,
                regulationMode: it.RegulationMode,
                manualSetPoint: it.ManualModeSetpoint / 100,
                comfortSetPoint: it.ComfortSetpoint / 100,
                vacationTemperature: it.VacationTemperature / 100,
            }
        });
    }

    constructor(apiKey: string, sessionId: string, httpClient: HttpClient, groupContents: GroupContent) {
        this.apiKey = apiKey;
        this.sessionId = sessionId;
        this.httpClient = httpClient;
        this.groupContents = groupContents;
    }

    async ecoMode() {
        await this.postUpdate({
            APIKEY: this.apiKey,
            SetGroup: {
                GroupId: this.groupContents.GroupId,
                RegulationMode: RegulationMode.Eco,
            }
        });
    }

    async resumeSchedule() {
        await this.postUpdate({
            APIKEY: this.apiKey,
            SetGroup: {
                GroupId: this.groupContents.GroupId,
                RegulationMode: RegulationMode.Schedule
            }
        });
    }

    async manualMode(targetTemperature: Temperature) {
        await this.postUpdate({
            APIKEY: this.apiKey,
            SetGroup: {
                GroupId: this.groupContents.GroupId,
                RegulationMode: RegulationMode.Manual,
                ManualModeSetpoint: targetTemperature.value * 100
            }
        });
    }

    async comfortMode(targetTemperature: Temperature, targetEndTime: Date) {
        await this.postUpdate({
            APIKEY: this.apiKey,
            SetGroup: {
                GroupId: this.groupContents.GroupId,
                RegulationMode: RegulationMode.Comfort,
                ComfortSetpoint: targetTemperature.value * 100,
                ComfortEndTime: formatRFC3339(targetEndTime),
            }
        });
    }

    async boostMode() {
        await this.postUpdate({
            APIKEY: this.apiKey,
            SetGroup: {
                BoostEndTime: formatRFC3339(addHours(new Date(), 1)),
                GroupId: this.groupContents.GroupId,
                RegulationMode: RegulationMode.Boost,
            }
        });
    }

    private async postUpdate(updateGroupContentRequest: any) {
        const params = new URLSearchParams();
        params.append('sessionid', this.sessionId);

        const response = await this.httpClient.postJson<UpdateGroupResponse>('Group/UpdateGroup?' + params.toString(), updateGroupContentRequest);

        // TODO add a test for when the api sends an invalid http status code

        // TODO Add a test for this case too
        if (response.ErrorCode !== 0) {
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
    regulationMode: RegulationMode
    manualSetPoint: number
    comfortSetPoint: number
    vacationTemperature: number
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

type UpdateGroupResponse = {
    ErrorCode: number
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

export enum RegulationMode {
    Schedule = 1,
    Comfort = 2,
    Manual = 3,
    Boost = 8,
    Eco = 9
}