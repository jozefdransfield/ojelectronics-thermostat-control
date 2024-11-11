import {vi} from 'vitest';

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

export function setupFetchMock() {
    global.fetch = vi.fn().mockImplementation((url, options) => {
        if (url.includes('api/UserProfile/SignIn')) {
            if (options.body.includes('invalid-username')) {
                return respondWithJson({
                    SessionId: '',
                    ErrorCode: 1,
                });
            } else if (options.body.includes('invalid-api-key')) {
                return respondWith({
                    status: 403,
                    statusText: 'Forbidden',
                });
            } else {
                return respondWithJson({
                    SessionId: 'session-id',
                    ErrorCode: 0,
                });
            }
        } else if (url.includes('api/Group/GroupContents')) {
            return respondWithJson({
                'GroupContents': [
                    {
                        'Action': 0,
                        'GroupId': 84140,
                        'GroupName': 'Kitchen',
                        'Thermostats': [
                            {
                                'Id': 203108,
                                'Action': 0,
                                'SerialNumber': '1175079',
                                'GroupName': 'Kitchen',
                                'GroupId': 84140,
                                'CustomerId': 42,
                                'SWversion': '1013W220',
                                'Online': true,
                                'Heating': false,
                                'RoomTemperature': 1644,
                                'FloorTemperature': 2406,
                                'RegulationMode': 1,
                                'Schedule': {
                                    'Days': [
                                        {
                                            'WeekDayGrpNo': 1,
                                            'Events': [
                                                {
                                                    'ScheduleType': 0,
                                                    'Clock': '07:00:00',
                                                    'Temperature': 3000,
                                                    'Active': true,
                                                    'EventIsOnNextDay': false
                                                },
                                                {
                                                    'ScheduleType': 1,
                                                    'Clock': '09:00:00',
                                                    'Temperature': 2000,
                                                    'Active': true,
                                                    'EventIsOnNextDay': false
                                                },
                                                {
                                                    'ScheduleType': 2,
                                                    'Clock': '12:00:00',
                                                    'Temperature': 2500,
                                                    'Active': false,
                                                    'EventIsOnNextDay': false
                                                },
                                                {
                                                    'ScheduleType': 3,
                                                    'Clock': '13:00:00',
                                                    'Temperature': 2000,
                                                    'Active': false,
                                                    'EventIsOnNextDay': false
                                                },
                                                {
                                                    'ScheduleType': 4,
                                                    'Clock': '17:00:00',
                                                    'Temperature': 2500,
                                                    'Active': true,
                                                    'EventIsOnNextDay': false
                                                },
                                                {
                                                    'ScheduleType': 5,
                                                    'Clock': '23:00:00',
                                                    'Temperature': 2000,
                                                    'Active': true,
                                                    'EventIsOnNextDay': false
                                                }
                                            ]
                                        },
                                        {
                                            'WeekDayGrpNo': 2,
                                            'Events': [
                                                {
                                                    'ScheduleType': 0,
                                                    'Clock': '07:00:00',
                                                    'Temperature': 3000,
                                                    'Active': true,
                                                    'EventIsOnNextDay': false
                                                },
                                                {
                                                    'ScheduleType': 1,
                                                    'Clock': '09:00:00',
                                                    'Temperature': 2000,
                                                    'Active': true,
                                                    'EventIsOnNextDay': false
                                                },
                                                {
                                                    'ScheduleType': 2,
                                                    'Clock': '12:00:00',
                                                    'Temperature': 2500,
                                                    'Active': false,
                                                    'EventIsOnNextDay': false
                                                },
                                                {
                                                    'ScheduleType': 3,
                                                    'Clock': '13:00:00',
                                                    'Temperature': 2000,
                                                    'Active': false,
                                                    'EventIsOnNextDay': false
                                                },
                                                {
                                                    'ScheduleType': 4,
                                                    'Clock': '17:00:00',
                                                    'Temperature': 2500,
                                                    'Active': true,
                                                    'EventIsOnNextDay': false
                                                },
                                                {
                                                    'ScheduleType': 5,
                                                    'Clock': '23:00:00',
                                                    'Temperature': 2000,
                                                    'Active': true,
                                                    'EventIsOnNextDay': false
                                                }
                                            ]
                                        },
                                        {
                                            'WeekDayGrpNo': 3,
                                            'Events': [
                                                {
                                                    'ScheduleType': 0,
                                                    'Clock': '07:00:00',
                                                    'Temperature': 3000,
                                                    'Active': true,
                                                    'EventIsOnNextDay': false
                                                },
                                                {
                                                    'ScheduleType': 1,
                                                    'Clock': '09:00:00',
                                                    'Temperature': 2000,
                                                    'Active': true,
                                                    'EventIsOnNextDay': false
                                                },
                                                {
                                                    'ScheduleType': 2,
                                                    'Clock': '12:00:00',
                                                    'Temperature': 2500,
                                                    'Active': false,
                                                    'EventIsOnNextDay': false
                                                },
                                                {
                                                    'ScheduleType': 3,
                                                    'Clock': '13:00:00',
                                                    'Temperature': 2000,
                                                    'Active': false,
                                                    'EventIsOnNextDay': false
                                                },
                                                {
                                                    'ScheduleType': 4,
                                                    'Clock': '17:00:00',
                                                    'Temperature': 2500,
                                                    'Active': true,
                                                    'EventIsOnNextDay': false
                                                },
                                                {
                                                    'ScheduleType': 5,
                                                    'Clock': '23:00:00',
                                                    'Temperature': 2000,
                                                    'Active': true,
                                                    'EventIsOnNextDay': false
                                                }
                                            ]
                                        },
                                        {
                                            'WeekDayGrpNo': 4,
                                            'Events': [
                                                {
                                                    'ScheduleType': 0,
                                                    'Clock': '07:00:00',
                                                    'Temperature': 3000,
                                                    'Active': true,
                                                    'EventIsOnNextDay': false
                                                },
                                                {
                                                    'ScheduleType': 1,
                                                    'Clock': '09:00:00',
                                                    'Temperature': 2000,
                                                    'Active': true,
                                                    'EventIsOnNextDay': false
                                                },
                                                {
                                                    'ScheduleType': 2,
                                                    'Clock': '12:00:00',
                                                    'Temperature': 2500,
                                                    'Active': false,
                                                    'EventIsOnNextDay': false
                                                },
                                                {
                                                    'ScheduleType': 3,
                                                    'Clock': '13:00:00',
                                                    'Temperature': 2000,
                                                    'Active': false,
                                                    'EventIsOnNextDay': false
                                                },
                                                {
                                                    'ScheduleType': 4,
                                                    'Clock': '17:00:00',
                                                    'Temperature': 2500,
                                                    'Active': true,
                                                    'EventIsOnNextDay': false
                                                },
                                                {
                                                    'ScheduleType': 5,
                                                    'Clock': '23:00:00',
                                                    'Temperature': 2000,
                                                    'Active': true,
                                                    'EventIsOnNextDay': false
                                                }
                                            ]
                                        },
                                        {
                                            'WeekDayGrpNo': 5,
                                            'Events': [
                                                {
                                                    'ScheduleType': 0,
                                                    'Clock': '07:00:00',
                                                    'Temperature': 3000,
                                                    'Active': true,
                                                    'EventIsOnNextDay': false
                                                },
                                                {
                                                    'ScheduleType': 1,
                                                    'Clock': '09:00:00',
                                                    'Temperature': 2000,
                                                    'Active': true,
                                                    'EventIsOnNextDay': false
                                                },
                                                {
                                                    'ScheduleType': 2,
                                                    'Clock': '12:00:00',
                                                    'Temperature': 2500,
                                                    'Active': false,
                                                    'EventIsOnNextDay': false
                                                },
                                                {
                                                    'ScheduleType': 3,
                                                    'Clock': '13:00:00',
                                                    'Temperature': 2000,
                                                    'Active': false,
                                                    'EventIsOnNextDay': false
                                                },
                                                {
                                                    'ScheduleType': 4,
                                                    'Clock': '17:00:00',
                                                    'Temperature': 2500,
                                                    'Active': true,
                                                    'EventIsOnNextDay': false
                                                },
                                                {
                                                    'ScheduleType': 5,
                                                    'Clock': '23:00:00',
                                                    'Temperature': 2000,
                                                    'Active': true,
                                                    'EventIsOnNextDay': false
                                                }
                                            ]
                                        },
                                        {
                                            'WeekDayGrpNo': 6,
                                            'Events': [
                                                {
                                                    'ScheduleType': 0,
                                                    'Clock': '07:00:00',
                                                    'Temperature': 3000,
                                                    'Active': true,
                                                    'EventIsOnNextDay': false
                                                },
                                                {
                                                    'ScheduleType': 1,
                                                    'Clock': '09:00:00',
                                                    'Temperature': 2000,
                                                    'Active': true,
                                                    'EventIsOnNextDay': false
                                                },
                                                {
                                                    'ScheduleType': 2,
                                                    'Clock': '12:00:00',
                                                    'Temperature': 2500,
                                                    'Active': false,
                                                    'EventIsOnNextDay': false
                                                },
                                                {
                                                    'ScheduleType': 3,
                                                    'Clock': '13:00:00',
                                                    'Temperature': 2000,
                                                    'Active': false,
                                                    'EventIsOnNextDay': false
                                                },
                                                {
                                                    'ScheduleType': 4,
                                                    'Clock': '17:00:00',
                                                    'Temperature': 2500,
                                                    'Active': true,
                                                    'EventIsOnNextDay': false
                                                },
                                                {
                                                    'ScheduleType': 5,
                                                    'Clock': '23:00:00',
                                                    'Temperature': 2000,
                                                    'Active': true,
                                                    'EventIsOnNextDay': false
                                                }
                                            ]
                                        },
                                        {
                                            'WeekDayGrpNo': 7,
                                            'Events': [
                                                {
                                                    'ScheduleType': 0,
                                                    'Clock': '07:00:00',
                                                    'Temperature': 3000,
                                                    'Active': true,
                                                    'EventIsOnNextDay': false
                                                },
                                                {
                                                    'ScheduleType': 1,
                                                    'Clock': '09:00:00',
                                                    'Temperature': 2000,
                                                    'Active': true,
                                                    'EventIsOnNextDay': false
                                                },
                                                {
                                                    'ScheduleType': 2,
                                                    'Clock': '12:00:00',
                                                    'Temperature': 2500,
                                                    'Active': false,
                                                    'EventIsOnNextDay': false
                                                },
                                                {
                                                    'ScheduleType': 3,
                                                    'Clock': '13:00:00',
                                                    'Temperature': 2000,
                                                    'Active': false,
                                                    'EventIsOnNextDay': false
                                                },
                                                {
                                                    'ScheduleType': 4,
                                                    'Clock': '17:00:00',
                                                    'Temperature': 2500,
                                                    'Active': true,
                                                    'EventIsOnNextDay': false
                                                },
                                                {
                                                    'ScheduleType': 5,
                                                    'Clock': '23:00:00',
                                                    'Temperature': 2000,
                                                    'Active': true,
                                                    'EventIsOnNextDay': false
                                                }
                                            ]
                                        }
                                    ],
                                    'ModifiedDueToVerification': false
                                },
                                'ComfortSetpoint': 2300,
                                'ComfortEndTime': '1900-01-01T00:00:00',
                                'ManualModeSetpoint': 0,
                                'VacationEnabled': false,
                                'VacationBeginDay': '2017-01-01T00:00:00',
                                'VacationEndDay': '2017-01-02T00:00:00',
                                'VacationTemperature': 500,
                                'LastPrimaryModeIsAuto': true,
                                'BoostEndTime': '1900-01-01T00:00:00',
                                'FrostProtectionTemperature': 500,
                                'ErrorCode': 0,
                                'ThermostatName': 'Kitchen',
                                'OpenWindow': true,
                                'AdaptiveMode': true,
                                'DaylightSaving': true,
                                'SensorAppl': 3,
                                'MinSetpoint': 500,
                                'MaxSetpoint': 4000,
                                'TimeZone': 0,
                                'DaylightSavingActive': false,
                                'FloorType': 1
                            }
                        ],
                        'RegulationMode': 1,
                        'Schedule': {
                            'Days': [
                                {
                                    'WeekDayGrpNo': 1,
                                    'Events': [
                                        {
                                            'ScheduleType': 0,
                                            'Clock': '07:00:00',
                                            'Temperature': 3000,
                                            'Active': true,
                                            'EventIsOnNextDay': false
                                        },
                                        {
                                            'ScheduleType': 1,
                                            'Clock': '09:00:00',
                                            'Temperature': 2000,
                                            'Active': true,
                                            'EventIsOnNextDay': false
                                        },
                                        {
                                            'ScheduleType': 2,
                                            'Clock': '12:00:00',
                                            'Temperature': 2500,
                                            'Active': false,
                                            'EventIsOnNextDay': false
                                        },
                                        {
                                            'ScheduleType': 3,
                                            'Clock': '13:00:00',
                                            'Temperature': 2000,
                                            'Active': false,
                                            'EventIsOnNextDay': false
                                        },
                                        {
                                            'ScheduleType': 4,
                                            'Clock': '17:00:00',
                                            'Temperature': 2500,
                                            'Active': true,
                                            'EventIsOnNextDay': false
                                        },
                                        {
                                            'ScheduleType': 5,
                                            'Clock': '23:00:00',
                                            'Temperature': 2000,
                                            'Active': true,
                                            'EventIsOnNextDay': false
                                        }
                                    ]
                                },
                                {
                                    'WeekDayGrpNo': 2,
                                    'Events': [
                                        {
                                            'ScheduleType': 0,
                                            'Clock': '07:00:00',
                                            'Temperature': 3000,
                                            'Active': true,
                                            'EventIsOnNextDay': false
                                        },
                                        {
                                            'ScheduleType': 1,
                                            'Clock': '09:00:00',
                                            'Temperature': 2000,
                                            'Active': true,
                                            'EventIsOnNextDay': false
                                        },
                                        {
                                            'ScheduleType': 2,
                                            'Clock': '12:00:00',
                                            'Temperature': 2500,
                                            'Active': false,
                                            'EventIsOnNextDay': false
                                        },
                                        {
                                            'ScheduleType': 3,
                                            'Clock': '13:00:00',
                                            'Temperature': 2000,
                                            'Active': false,
                                            'EventIsOnNextDay': false
                                        },
                                        {
                                            'ScheduleType': 4,
                                            'Clock': '17:00:00',
                                            'Temperature': 2500,
                                            'Active': true,
                                            'EventIsOnNextDay': false
                                        },
                                        {
                                            'ScheduleType': 5,
                                            'Clock': '23:00:00',
                                            'Temperature': 2000,
                                            'Active': true,
                                            'EventIsOnNextDay': false
                                        }
                                    ]
                                },
                                {
                                    'WeekDayGrpNo': 3,
                                    'Events': [
                                        {
                                            'ScheduleType': 0,
                                            'Clock': '07:00:00',
                                            'Temperature': 3000,
                                            'Active': true,
                                            'EventIsOnNextDay': false
                                        },
                                        {
                                            'ScheduleType': 1,
                                            'Clock': '09:00:00',
                                            'Temperature': 2000,
                                            'Active': true,
                                            'EventIsOnNextDay': false
                                        },
                                        {
                                            'ScheduleType': 2,
                                            'Clock': '12:00:00',
                                            'Temperature': 2500,
                                            'Active': false,
                                            'EventIsOnNextDay': false
                                        },
                                        {
                                            'ScheduleType': 3,
                                            'Clock': '13:00:00',
                                            'Temperature': 2000,
                                            'Active': false,
                                            'EventIsOnNextDay': false
                                        },
                                        {
                                            'ScheduleType': 4,
                                            'Clock': '17:00:00',
                                            'Temperature': 2500,
                                            'Active': true,
                                            'EventIsOnNextDay': false
                                        },
                                        {
                                            'ScheduleType': 5,
                                            'Clock': '23:00:00',
                                            'Temperature': 2000,
                                            'Active': true,
                                            'EventIsOnNextDay': false
                                        }
                                    ]
                                },
                                {
                                    'WeekDayGrpNo': 4,
                                    'Events': [
                                        {
                                            'ScheduleType': 0,
                                            'Clock': '07:00:00',
                                            'Temperature': 3000,
                                            'Active': true,
                                            'EventIsOnNextDay': false
                                        },
                                        {
                                            'ScheduleType': 1,
                                            'Clock': '09:00:00',
                                            'Temperature': 2000,
                                            'Active': true,
                                            'EventIsOnNextDay': false
                                        },
                                        {
                                            'ScheduleType': 2,
                                            'Clock': '12:00:00',
                                            'Temperature': 2500,
                                            'Active': false,
                                            'EventIsOnNextDay': false
                                        },
                                        {
                                            'ScheduleType': 3,
                                            'Clock': '13:00:00',
                                            'Temperature': 2000,
                                            'Active': false,
                                            'EventIsOnNextDay': false
                                        },
                                        {
                                            'ScheduleType': 4,
                                            'Clock': '17:00:00',
                                            'Temperature': 2500,
                                            'Active': true,
                                            'EventIsOnNextDay': false
                                        },
                                        {
                                            'ScheduleType': 5,
                                            'Clock': '23:00:00',
                                            'Temperature': 2000,
                                            'Active': true,
                                            'EventIsOnNextDay': false
                                        }
                                    ]
                                },
                                {
                                    'WeekDayGrpNo': 5,
                                    'Events': [
                                        {
                                            'ScheduleType': 0,
                                            'Clock': '07:00:00',
                                            'Temperature': 3000,
                                            'Active': true,
                                            'EventIsOnNextDay': false
                                        },
                                        {
                                            'ScheduleType': 1,
                                            'Clock': '09:00:00',
                                            'Temperature': 2000,
                                            'Active': true,
                                            'EventIsOnNextDay': false
                                        },
                                        {
                                            'ScheduleType': 2,
                                            'Clock': '12:00:00',
                                            'Temperature': 2500,
                                            'Active': false,
                                            'EventIsOnNextDay': false
                                        },
                                        {
                                            'ScheduleType': 3,
                                            'Clock': '13:00:00',
                                            'Temperature': 2000,
                                            'Active': false,
                                            'EventIsOnNextDay': false
                                        },
                                        {
                                            'ScheduleType': 4,
                                            'Clock': '17:00:00',
                                            'Temperature': 2500,
                                            'Active': true,
                                            'EventIsOnNextDay': false
                                        },
                                        {
                                            'ScheduleType': 5,
                                            'Clock': '23:00:00',
                                            'Temperature': 2000,
                                            'Active': true,
                                            'EventIsOnNextDay': false
                                        }
                                    ]
                                },
                                {
                                    'WeekDayGrpNo': 6,
                                    'Events': [
                                        {
                                            'ScheduleType': 0,
                                            'Clock': '07:00:00',
                                            'Temperature': 3000,
                                            'Active': true,
                                            'EventIsOnNextDay': false
                                        },
                                        {
                                            'ScheduleType': 1,
                                            'Clock': '09:00:00',
                                            'Temperature': 2000,
                                            'Active': true,
                                            'EventIsOnNextDay': false
                                        },
                                        {
                                            'ScheduleType': 2,
                                            'Clock': '12:00:00',
                                            'Temperature': 2500,
                                            'Active': false,
                                            'EventIsOnNextDay': false
                                        },
                                        {
                                            'ScheduleType': 3,
                                            'Clock': '13:00:00',
                                            'Temperature': 2000,
                                            'Active': false,
                                            'EventIsOnNextDay': false
                                        },
                                        {
                                            'ScheduleType': 4,
                                            'Clock': '17:00:00',
                                            'Temperature': 2500,
                                            'Active': true,
                                            'EventIsOnNextDay': false
                                        },
                                        {
                                            'ScheduleType': 5,
                                            'Clock': '23:00:00',
                                            'Temperature': 2000,
                                            'Active': true,
                                            'EventIsOnNextDay': false
                                        }
                                    ]
                                },
                                {
                                    'WeekDayGrpNo': 7,
                                    'Events': [
                                        {
                                            'ScheduleType': 0,
                                            'Clock': '07:00:00',
                                            'Temperature': 3000,
                                            'Active': true,
                                            'EventIsOnNextDay': false
                                        },
                                        {
                                            'ScheduleType': 1,
                                            'Clock': '09:00:00',
                                            'Temperature': 2000,
                                            'Active': true,
                                            'EventIsOnNextDay': false
                                        },
                                        {
                                            'ScheduleType': 2,
                                            'Clock': '12:00:00',
                                            'Temperature': 2500,
                                            'Active': false,
                                            'EventIsOnNextDay': false
                                        },
                                        {
                                            'ScheduleType': 3,
                                            'Clock': '13:00:00',
                                            'Temperature': 2000,
                                            'Active': false,
                                            'EventIsOnNextDay': false
                                        },
                                        {
                                            'ScheduleType': 4,
                                            'Clock': '17:00:00',
                                            'Temperature': 2500,
                                            'Active': true,
                                            'EventIsOnNextDay': false
                                        },
                                        {
                                            'ScheduleType': 5,
                                            'Clock': '23:00:00',
                                            'Temperature': 2000,
                                            'Active': true,
                                            'EventIsOnNextDay': false
                                        }
                                    ]
                                }
                            ],
                            'ModifiedDueToVerification': false
                        },
                        'ComfortSetpoint': 2300,
                        'ComfortEndTime': '1900-01-01T00:00:00',
                        'ManualModeSetpoint': 0,
                        'VacationEnabled': false,
                        'VacationBeginDay': '2017-01-01T00:00:00',
                        'VacationEndDay': '2017-01-02T00:00:00',
                        'VacationTemperature': 500,
                        'LastPrimaryModeIsAuto': true,
                        'BoostEndTime': '1900-01-01T00:00:00',
                        'FrostProtectionTemperature': 500
                    }
                ],
                'ErrorCode': 0
            });
        }

    });
}
