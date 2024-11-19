import {addHours, formatRFC3339} from "date-fns";
import {GroupContent, RegulationMode, Temperature, Thermostat} from "./types";

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