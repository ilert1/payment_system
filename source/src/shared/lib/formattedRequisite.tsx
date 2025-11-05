import { formatPhoneNumber } from "./formatPhoneNumber";

export const formatedRequisite = (req: string, isPhone: boolean, caseName: string) => {
    if (req) {
        req = req.replace(/\s+/g, "");
        if (isPhone) {
            return formatPhoneNumber(req) ?? "";
        } else {
            if (caseName === "ars") {
                return req;
            }
            if (caseName === "bdt") {
                return req.replace(/(.{3})(.{4})(.{4})/, "$1 $2 $3");
            }
            return req.replace(/(.{4})/g, "$1 ");
        }
    }
};
