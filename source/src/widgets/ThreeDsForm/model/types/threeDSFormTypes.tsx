import { NavigateFunction } from "react-router-dom";
import { z } from "zod";

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
    setBfData: (data: BFDataType) => void;
    dest: string;
    bfId: string;
    navigate: NavigateFunction;
    payOutMode: boolean;
}

export interface SubmitFormSliceParams {
    formData: ThreeDsFormValues;
    navigate: NavigateFunction;
    fingerprintConfig: HeadersInit;
}
