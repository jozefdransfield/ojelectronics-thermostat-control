import {GroupContentsResponse} from "./types";
import {Group} from "./group";

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