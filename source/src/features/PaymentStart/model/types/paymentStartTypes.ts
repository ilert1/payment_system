export interface StartPaymentParams {
    fingerprintHeaders: HeadersInit;
    setStatus: (data: string) => void;
    dest: string;
    bfId: string;
}

export interface SubmitFormSliceParams {
    fingerprintHeaders: HeadersInit;
}

export interface PaymentStartStore {
    isFetching: boolean;
    setIsFetching: (state: boolean) => void;
    startPayment: (params: SubmitFormSliceParams) => Promise<BFDataType | undefined>;
}
