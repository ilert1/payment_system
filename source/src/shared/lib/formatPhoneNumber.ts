import { parsePhoneNumberFromString } from "libphonenumber-js";

export function formatPhoneNumber(phone: string) {
    try {
        const phoneNumber = parsePhoneNumberFromString(phone);
        if (!phoneNumber) return phone;

        return phoneNumber.formatInternational();
    } catch {
        return phone;
    }
}
