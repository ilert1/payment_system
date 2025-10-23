import { NavigateFunction } from "react-router-dom";

export type ThreeDsFormValues = {
    threeDsCode: string;
};

export interface ThreeDsFormStore {
    isFetching: boolean;
    setIsFetching: (state: boolean) => void;
    submitForm: (params: SubmitFormSliceParams) => Promise<BFDataType | undefined>;
}

export interface SubmitFormParams {
    formData: ThreeDsFormValues;
    fingerprintHeaders: HeadersInit;
    setStatus: (data: string) => void;
    dest: string;
    bfId: string;
}

export interface SubmitFormSliceParams {
    formData: ThreeDsFormValues;
    navigate: NavigateFunction;
    fingerprintConfig: HeadersInit;
}
