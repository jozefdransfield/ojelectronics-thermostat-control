import {describe, it, expect, vi} from 'vitest';
import {OJElectronics} from '../src';
import { readFile } from "node:fs/promises";

const API_KEY = '<api-key>';
const USERNAME = '<username>';
const PASSWORD = '<PASSWORD>';

setupFetchMock();

describe('The Api', async () => {
    it('should fail to create a session if the api key is invalid', async () => {
        const api = new OJElectronics('invalid-api-key', 1);
        expect(async () => {
            await api.session('username', 'password');
        }).rejects.toThrowError('Create Session Failed with 403 Forbidden');
    });

    it('should fail to create a session if the username/password is invalid', async () => {
        const api = new OJElectronics(API_KEY, 1);
        expect(async () => {
            await api.session('invalid-username', 'password');
        }).rejects.toThrowError('Create Session Failed to authenticate');
    });

    describe('should create a session', async () => {
        const api = new OJElectronics(API_KEY, 1);
        const session = await api.session(USERNAME, PASSWORD);

        it('should throw exception if we get an error from the api', async () => {
            const groups = await session.groups();

            expect(groups).toBeTruthy();
        });

        it('should get group contents', async () => {
            const groups = await session.groups();

            expect(groups).toBeTruthy();
        });
    });
});

function respondWith(response: any) {
    return new Promise((resolve) => {
        resolve(response);
    });
}

function respondWithJson(jsonResponse: any) {
    return respondWith({
        status: 200,
        json: () => new Promise((resolve) => resolve(jsonResponse)),
    });
}

async function jsonFromFile(filename: string) {
    return JSON.parse( await readFile(filename, 'utf8') );
}

export function setupFetchMock() {
    global.fetch = vi.fn().mockImplementation((url, options) => {
        if (url.includes('api/UserProfile/SignIn')) {
            if (options.body.includes('invalid-username')) {
                return respondWithJson(jsonFromFile('./test/fixtures/invalid-credentials-response.json'));
            } else if (options.body.includes('invalid-api-key')) {
                return respondWith(jsonFromFile('./test/fixtures/invalid-apikey-response.json'));
            } else {
                return respondWithJson(jsonFromFile('./test/fixtures/session-response.json'));
            }
        } else if (url.includes('api/Group/GroupContents')) {
            return respondWithJson(jsonFromFile('./test/fixtures/group-contents-response.json'));
        }

    });
}
