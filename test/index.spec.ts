import {describe, it, expect, vi, afterEach} from 'vitest';
import {HttpClient, OJElectronics} from '../src';
import {mock} from 'vitest-mock-extended';
import {readFile} from "node:fs/promises";

const API_KEY = '<api-key>';
const USERNAME = '<username>';
const PASSWORD = '<PASSWORD>';

describe('The Api', async () => {
    it('should fail to create a session if the api key is invalid', async () => {
        const httpClient = mock<HttpClient>();
        httpClient.postJson.mockRejectedValue(new Error('Error response requesting /UserProfile/SignIn 403 Forbidden'));

        const api = new OJElectronics('invalid-api-key', 1, httpClient);

        expect(async () => {
            await api.session('username', 'password');
        }).rejects.toThrowError('Error response requesting /UserProfile/SignIn 403 Forbidden');
    });

    it('should fail to create a session if the username/password is invalid', async () => {
        const httpClient = mock<HttpClient>();
        httpClient.postJson.mockResolvedValue(jsonFromFile('./test/fixtures/invalid-credentials-response.json'));

        const api = new OJElectronics(API_KEY, 1, httpClient);

        expect(async () => {
            await api.session('invalid-username', 'password');
        }).rejects.toThrowError('Create Session Failed to authenticate');
    });

    describe('should create a session', async () => {
        const httpClient = mock<HttpClient>();
        httpClient.postJson.mockResolvedValue(jsonFromFile('./test/fixtures/session-response.json'));

        const api = new OJElectronics(API_KEY, 1, httpClient);
        const session = await api.session(USERNAME, PASSWORD);

        it('should throw exception if we get an error status code from the api', async () => {
            httpClient.get.mockRejectedValue(new Error('Error response requesting /Group/GroupContents 403 Forbidden'));

            expect(async () => {
                await session.groups()
            }).rejects.toThrowError('Error response requesting /Group/GroupContents 403 Forbidden')
        });

        it('should throw exception if we get an error response from the api', async () => {
            httpClient.get.mockResolvedValue(jsonFromFile('./test/fixtures/group-contents-error-response.json'));

            expect(async () => {
                await session.groups()
            }).rejects.toThrowError('Failed to get groups, with error code 1')
        });

        describe('should get group contents', async () => {
            httpClient.get.mockResolvedValue(jsonFromFile('./test/fixtures/group-contents-response.json'));
            const groups = await session.groups();
            const firstGroup = groups[0];

            it('should respond with the thermostats', async () => {
                expect(firstGroup.thermostats).toBeTruthy();
            })
        });
    });
});

async function jsonFromFile(filename: string) {
    return JSON.parse(await readFile(filename, 'utf8'));
}
