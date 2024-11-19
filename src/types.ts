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

export type UpdateGroupContentRequest = {
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

export type SignInResponse = {
    SessionId: string;
    ErrorCode: number;
}

export type GroupContentsResponse = {
    GroupContents: GroupContent[];
    ErrorCode: number;
}

export type GroupContent = {
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

export type Schedule = {
    Days: Day[],
    ModifiedDueToVerification: boolean
}

export type Day = {
    WeekDayGrpNo: number,
    Events: Event[]
}

export type Event = {
    ScheduleType: number,
    Clock: string,
    Temperature: number,
    Active: boolean,
    EventIsOnNextDay: boolean
}

export type ThermostatResponse = {
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