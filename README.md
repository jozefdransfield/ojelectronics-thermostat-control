# OJ Electronics Thermostat Controls

I am not fully aware of all the devices that use the same api, but HeatMat and OJ Electronics both provide a thermostat that uses the same backend but with different customer codes:

This library supports

- HeatMat NGTouch wireless (https://www.heatmat.co.uk/under-floor-heating/ngtouch-wifi-thermostat/)
- OJElectronics MWD5 (https://ojelectronics.com/floorheating/products/wifi-thermostat-mwd5/)

## Customer Ids

So far I am aware of two customer ids

| Thermostat Brand | Customer Code |
|------------------|---------------|
| HeatMat          | 99            |
| Oj Electronics   |  1            | 


## Create a Session
```aiignore

const API_KEY = 'f219aab4-9ac0-4343-8422-b72203e2fac9';
const USERNAME = '<your username>';
const PASSWORD = '<your password>';

const CUSTOMER_ID = 1;

const api = new API(API_KEY, CUSTOMER_ID);
const session = await api.session(USERNAME, PASSWORD);
```
## Session Information
```aiignore
const groups = await session.groups();

const firstGroup = groups[0];

await firstGroup.ecoMode();
```


Thanks to this forum post for the API details:
https://community.home-assistant.io/t/mwd5-wifi-thermostat-oj-electronics-microtemp/445601