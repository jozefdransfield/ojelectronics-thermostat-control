import {describe, it, expect} from 'vitest';
import {Temperature} from "../src";


describe('The Temperature class', async () => {
    it('should be created from degrees celsius', async () => {
        const temp = Temperature.ofCelsius(30)

        expect(temp.value).toBe(30)
    });

    it('should be created from degrees kelvin', async () => {
        const temp = Temperature.ofKelvin(303.15)

        expect(temp.value).toBe(30)
    });

    it('should be created from degrees fahrenheit', async () => {
        const temp = Temperature.ofFahrenheit(86)

        expect(temp.value).toBe(30)
    });
});
