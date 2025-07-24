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

    type PaymentInstrument = {
        bank: string;
        bank_name: string;
        payment_type: string;
        payment_type_name: string;
        customer_schema: null;
        required: null;
    };

    type BFDataType = {
        payout?: {
            id: string;
            amount: string;
            currency: string;
            method: {
                name: string;
                display_name: string;
                bank: {
                    name: string;
                    display_name: Record<string, string>;
                };
                payer: {
                    schema: {
                        type: string;
                        properties: {
                            card_holder: {
                                type: string;
                                description: string;
                                format: string;
                            };
                            card_cvc: {
                                type: string;
                                description: string;
                                format: string;
                            };
                            card_lifetime: {
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
                    required: string[];
                    data: {
                        card_cvc: string;
                        card_holder: string;
                        card_lifetime_month: string;
                        card_lifetime_year: string;
                        card_number: string;
                    };
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
                    required: string[];
                    data: {
                        bank_name?: string;
                        card_holder?: string;
                        card_number?: string;
                        direction_id?: string;
                        phone?: string;
                        account_number?: string;
                        phone_number?: string;
                        iban_number?: string;
                    };
                    redirect_url?: string;
                };
                context: {
                    success_redirect_url?: string;
                    error_redirect_url?: string;
                    cancel_redirect_url?: string;
                    back_redirect_url?: string;
                    provider?: string;
                    confirm_type?: string;
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
                bank: {
                    name: string;
                    display_name: Record<string, string>;
                };
                payer: {
                    schema: {
                        type: string;
                        properties: {
                            card_holder: {
                                type: string;
                                description: string;
                                format: string;
                            };
                            card_cvc: {
                                type: string;
                                description: string;
                                format: string;
                            };
                            card_lifetime: {
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
                    required: string[];
                    data: {
                        card_cvc: string;
                        card_holder: string;
                        card_lifetime_month: string;
                        card_lifetime_year: string;
                        card_number: string;
                    };
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
                    required: string[];
                    data: {
                        bank_name?: string;
                        card_holder?: string;
                        card_number?: string;
                        direction_id?: string;
                        phone?: string;
                        account_number?: string;
                        phone_number?: string;
                        iban_number?: string;
                    };
                    redirect_url?: string;
                };
                context: {
                    success_redirect_url?: string;
                    error_redirect_url?: string;
                    cancel_redirect_url?: string;
                    back_redirect_url?: string;

                    provider?: string;
                    confirm_type?: string;
                };
            };
            status: string;
            created_at: number;
        };
    };
}

export {};
