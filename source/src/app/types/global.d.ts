/// <reference types="vite-plugin-svgr/client" />

import { FunctionComponent, SVGProps } from "react";

declare module "*.svg" {
    const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
    export default content;
}

declare global {
    type SvgComponent = FunctionComponent<
        SVGProps<SVGSVGElement> & {
            title?: string;
            titleId?: string;
            desc?: string;
            descId?: string;
        }
    >;

    type MessageType = "user" | "operator" | "moderator";

    type Message = {
        files: any[];
        text: string;
        type: MessageType;
        timestamp: string;
    };

    type Trader = {
        card_number: string;
        phone: string;
        account_number: string;
        phone_number: string;
        iban_number: string;
        bank_name: string;
        card_holder: string;
    };

    type PaymentMethod = {
        method_name: string;
        method_logo: string;
        method_id: string;
    };
}
