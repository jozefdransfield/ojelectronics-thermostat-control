import {describe, it, expect} from 'vitest';
import {HttpClient, OJElectronics, Temperature} from '../src';
import {any, mock} from 'vitest-mock-extended';
import {readFile} from "node:fs/promises";

const API_KEY = '<api-key>';
const USERNAME = '<username>';
const PASSWORD = '<PASSWORD>';
const CUSTOMER_ID = 1;

describe('The Api', async () => {
    it('should fail to create a session if the api key is invalid', async () => {
        const httpClient = mock<HttpClient>();
        httpClient.postJson.calledWith('/UserProfile/SignIn', any()).mockRejectedValue(new Error('Error response requesting /UserProfile/SignIn 403 Forbidden'));

        const api = new OJElectronics('invalid-api-key', CUSTOMER_ID, httpClient);

        expect(async () => {
            await api.session('username', 'password');
        }).rejects.toThrowError('Error response requesting /UserProfile/SignIn 403 Forbidden');
    });

    it('should fail to create a session if the username/password is invalid', async () => {
        const httpClient = mock<HttpClient>();
        httpClient.postJson.calledWith('/UserProfile/SignIn', any()).mockResolvedValue(jsonFromFile('./test/fixtures/invalid-credentials-response.json'));

        const api = new OJElectronics(API_KEY, 1, httpClient);

        expect(async () => {
            await api.session('invalid-username', 'password');
        }).rejects.toThrowError('Create Session Failed to authenticate');
    });

    describe('should create a session', async () => {
        const httpClient = mock<HttpClient>();
        httpClient.postJson.calledWith('/UserProfile/SignIn', any()).mockResolvedValue(jsonFromFile('./test/fixtures/session-response.json'));

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

            describe("eco mode", async () => {
                it('should throw exception if request to set eco mode fails with status code', async () => {
                    httpClient.postJson.calledWith('/Group/UpdateGroup?sessionid=session-id', any()).mockRejectedValue(new Error('Failed to set eco mode'));

                    expect(async () => {
                        await firstGroup.ecoMode()
                    }).rejects.toThrowError('Failed to set eco mode')
                })

                it('should throw exception if request to set eco mode fails with error response', async () => {
                    httpClient.postJson.calledWith('/Group/UpdateGroup?sessionid=session-id', any()).mockResolvedValue(jsonFromFile('./test/fixtures/update-group-error-response.json'));

                    expect(async () => {
                        await firstGroup.ecoMode()
                    }).rejects.toThrowError('Failed to update group with error code 1')
                })

                it('should set ecoMode ', async () => {
                    httpClient.postJson.calledWith('/Group/UpdateGroup?sessionid=session-id', any()).mockResolvedValue(jsonFromFile('./test/fixtures/update-group-response.json'));

                    await firstGroup.ecoMode()
                })
            });

            describe("manual mode", async () => {
                it('should throw exception if request to set manual mode fails with status code', async () => {
                    httpClient.postJson.calledWith('/Group/UpdateGroup?sessionid=session-id', any()).mockRejectedValue(new Error('Failed to set mode'));

                    expect(async () => {
                        await firstGroup.manualMode(Temperature.ofCelsius(30))
                    }).rejects.toThrowError('Failed to set mode')
                })

                it('should throw exception if request to set manual mode fails with error response', async () => {
                    httpClient.postJson.calledWith('/Group/UpdateGroup?sessionid=session-id', any()).mockResolvedValue(jsonFromFile('./test/fixtures/update-group-error-response.json'));

                    expect(async () => {
                        await firstGroup.manualMode(Temperature.ofCelsius(30))
                    }).rejects.toThrowError('Failed to update group with error code 1')
                })

                it('should set manual mode ', async () => {
                    httpClient.postJson.calledWith('/Group/UpdateGroup?sessionid=session-id', any()).mockResolvedValue(jsonFromFile('./test/fixtures/update-group-response.json'));

                    await firstGroup.manualMode(Temperature.ofCelsius(30))
                })
            });

            describe("resume schedule", async () => {
                it('should throw exception if request to resume schedule fails with status code', async () => {
                    httpClient.postJson.calledWith('/Group/UpdateGroup?sessionid=session-id', any()).mockRejectedValue(new Error('Failed to set mode'));

                    expect(async () => {
                        await firstGroup.resumeSchedule()
                    }).rejects.toThrowError('Failed to set mode')
                })

                it('should throw exception if request to resume schedule fails with error response', async () => {
                    httpClient.postJson.calledWith('/Group/UpdateGroup?sessionid=session-id', any()).mockResolvedValue(jsonFromFile('./test/fixtures/update-group-error-response.json'));

                    expect(async () => {
                        await firstGroup.resumeSchedule()
                    }).rejects.toThrowError('Failed to update group with error code 1')
                })

                it('should resume schedule ', async () => {
                    httpClient.postJson.calledWith('/Group/UpdateGroup?sessionid=session-id', any()).mockResolvedValue(jsonFromFile('./test/fixtures/update-group-response.json'));

                    await firstGroup.resumeSchedule()
                })
            });

            describe("comfort mode", async () => {
                it('should throw exception if request to set comfort mode fails with status code', async () => {
                    httpClient.postJson.calledWith('/Group/UpdateGroup?sessionid=session-id', any()).mockRejectedValue(new Error('Failed to set mode'));

                    expect(async () => {
                        await firstGroup.comfortMode(Temperature.ofCelsius(30), new Date())
                    }).rejects.toThrowError('Failed to set mode')
                })

                it('should throw exception if request to set comfort mode fails with error response', async () => {
                    httpClient.postJson.calledWith('/Group/UpdateGroup?sessionid=session-id', any()).mockResolvedValue(jsonFromFile('./test/fixtures/update-group-error-response.json'));

                    expect(async () => {
                        await firstGroup.comfortMode(Temperature.ofCelsius(30), new Date())
                    }).rejects.toThrowError('Failed to update group with error code 1')
                })

                it('should set comfort mode', async () => {
                    httpClient.postJson.calledWith('/Group/UpdateGroup?sessionid=session-id', any()).mockResolvedValue(jsonFromFile('./test/fixtures/update-group-response.json'));

                    await firstGroup.comfortMode(Temperature.ofCelsius(30), new Date())
                })
            });

            describe("boost mode", async () => {
                it('should throw exception if request to set boost mode fails with status code', async () => {
                    httpClient.postJson.calledWith('/Group/UpdateGroup?sessionid=session-id', any()).mockRejectedValue(new Error('Failed to set mode'));

                    expect(async () => {
                        await firstGroup.boostMode()
                    }).rejects.toThrowError('Failed to set mode')
                })

                it('should throw exception if request to set boost mode fails with error response', async () => {
                    httpClient.postJson.calledWith('/Group/UpdateGroup?sessionid=session-id', any()).mockResolvedValue(jsonFromFile('./test/fixtures/update-group-error-response.json'));

                    expect(async () => {
                        await firstGroup.boostMode()
                    }).rejects.toThrowError('Failed to update group with error code 1')
                })

                it('should set boost mode', async () => {
                    httpClient.postJson.calledWith('/Group/UpdateGroup?sessionid=session-id', any()).mockResolvedValue(jsonFromFile('./test/fixtures/update-group-response.json'));

                    await firstGroup.boostMode()
                })
            });
        });
    });
});

async function jsonFromFile(filename: string) {
    return JSON.parse(await readFile(filename, 'utf8'));
}
