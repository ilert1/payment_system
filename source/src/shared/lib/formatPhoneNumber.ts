import { parsePhoneNumberWithError } from "libphonenumber-js";

export function formatPhoneNumber(phone: string) {
    try {
        const phoneWithPlus = phone.startsWith("+") ? phone : "+" + phone;
        const formattedPhoneNumber = parsePhoneNumberWithError(phoneWithPlus);

        if (!formattedPhoneNumber) return phone;
        return formattedPhoneNumber.formatInternational();
    } catch (err) {
        return phone;
    }
}
