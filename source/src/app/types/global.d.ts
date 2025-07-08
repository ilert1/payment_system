import { FunctionComponent, SVGProps } from "react";

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

    // const LangVariants: {
    //     en: "en";
    //     az: "az";
    //     ky: "ky";
    //     tg: "tg";
    //     kk: "kk";
    //     ru: "ru";
    //     tr: "tr";
    //     uk: "uk";
    //     uz: "uz";
    // };

    // type LangType = keyof typeof LangVariants;

    type BFDataType = {
        payout: {
            id: string;
            amount: string;
            currency: string;
            method: {
                name: string;
                display_name: string;
                payer: {
                    schema: {
                        // TODO type ?
                        type: string;
                        properties: {
                            card_holder: {
                                type: string;
                                description: string;
                                format: string;
                            };
                            card_last_digits: {
                                type: string;
                                description: string;
                                format: string;
                            };
                        };
                    };
                    required: null;
                };
                payee: {
                    schema: {
                        // TODO type?
                        type: string;
                        properties: {
                            card_holder: {
                                type: string;
                                description: string;
                                format: string;
                            };
                            card_number: {
                                type: string;
                                description: string;
                                format: string;
                            };
                        };
                    };
                    required: null;
                    data: {
                        bank_name: string;
                        card_holder: string;
                        card_number: string;
                        direction_id: string;
                    };
                };
                context: {
                    success_redirect_url?: string;
                    error_redirect_url?: string;
                    cancel_redirect_url?: string;
                    back_redirect_url?: string;
                    success_url?: string;
                    fail_url?: string;
                    return_url?: string;
                    redirect_url?: string;
                    provider?: string;
                };
            };
            status: string;
            created_at: number;
        };
        payment: {
            id: string;
            amount: string;
            currency: string;
            method: {
                name: string;
                display_name: string;
                payer: {
                    schema: {
                        type: string;
                        properties: {
                            card_holder: {
                                type: string;
                                description: string;
                                format: string;
                            };
                            card_last_digits: {
                                type: string;
                                description: string;
                                format: string;
                            };
                        };
                    };
                    required: null;
                };
                payee: {
                    schema: {
                        type: string;
                        properties: {
                            card_holder: {
                                type: string;
                                description: string;
                                format: string;
                            };
                            card_number: {
                                type: string;
                                description: string;
                                format: string;
                            };
                        };
                    };
                    required: null;
                    data: {
                        bank_name: string;
                        card_holder: string;
                        card_number: string;
                        direction_id: string;
                    };
                };
                context: {
                    success_redirect_url?: string;
                    error_redirect_url?: string;
                    cancel_redirect_url?: string;
                    back_redirect_url?: string;
                    success_url?: string;
                    fail_url?: string;
                    return_url?: string;
                    redirect_url?: string;
                    provider?: string;
                };
            };
            status: string;
            created_at: number;
        };
    };
}

export {};
