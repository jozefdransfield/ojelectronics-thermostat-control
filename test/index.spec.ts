import {describe, it, expect} from 'vitest';
import {OJElectronics} from '../index';
import {setupFetchMock} from './util/fetch-mock';

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

        it('should get group contents', async () => {
            const groups = await session.groups();

            expect(groups).toBeTruthy();
        });
    });
});