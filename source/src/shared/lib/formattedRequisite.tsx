export const formatedRequisite = (req: string, isPhone: boolean, caseName: string) => {
    if (req) {
        req = req.replace(/\s+/g, "");
        if (isPhone) {
            if (caseName === "tjs" || caseName === "azn") {
                return req.replace(/^\+?(\d{3})(\d{2})(\d{3})(\d{4})$/, "+$1 ($2) $3 $4");
            } else {
                return req.replace(/^\+?(\d{1})(\d{3})(\d{3})(\d{4})$/, "+$1 ($2) $3 $4");
            }
        } else {
            if (caseName === "ars") {
                return req;
            }
            return req.replace(/(.{4})/g, "$1 ");
        }
    }
};
