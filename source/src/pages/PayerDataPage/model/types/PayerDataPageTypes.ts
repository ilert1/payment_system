export type PaymentStore = {
    isFetching: boolean;
    setIsFetching: (state: boolean) => void;
    fetchPaymentInit: (params: {
        dest: "payment" | "payout";
        bfId: string;
        navigate: (path: string) => void;
        payOutMode: boolean;
    }) => Promise<BFDataType | undefined>;
};

export interface GetPaymentParams {
    bfId: string;
    dest: "payment" | "payout";
    fingerprintHeaders: HeadersInit;
    payOutMode: boolean;
    setBfData: (data: BFDataType) => void;
    navigate: (path: string) => void;
}
