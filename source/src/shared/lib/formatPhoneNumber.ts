import { CountryCode, parsePhoneNumberFromString } from "libphonenumber-js";

export function formatPhoneNumber(phone: string, country?: CountryCode) {
    try {
        const phoneNumber = parsePhoneNumberFromString(phone, country);
        if (!phoneNumber) return phone;

        return phoneNumber.formatInternational();
    } catch {
        return phone;
    }
}
