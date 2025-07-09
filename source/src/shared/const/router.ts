export enum AppRoutes {
    PAGE_MAIN = "/",
    PAYER_DATA_PAGE = "payer-data-page",
    PAYEE_SEARCH_PAGE = "payee-search-page",
    PAY_PAGE = "pay-page",
    PAYEE_DATA_PAGE = "payee-data-page",
    SUCCESS_PAGE = "success-page",
    PAY_ERROR_PAGE = "pay-error-page",
    PAYMENT_CONFIRMATION_PAGE = "payment-confirmation-page",
    PAYMENT_WAIT_CONFIRMATION = "payment-wait-confirmation",
    GENERAL_ERROR_PAGE = "general-error-page",
    CANCEL_PAGE = "cancel-page",
    PAYMENT_INSTRUMENT = "payment-instrument",
    PAGE_PAYMENT_NOT_FOUND = "payment-not-found",
    PAGE_PAYOUT_NOT_FOUND = "payout-not-found",
    PAGE_PAYMENT_INSTRUMENT = "payment-instrument-page",
    PAGE_PAY_ERROR = "payment-fault",
    PAGE_OUT_PAY = "pay-out-page",
    PAGE_PAYMENTS_BLOWFISH_ID = "payments/:blowfishId",
    PAGE_PAYOUTS_BLOWFISH_ID = "payouts/:blowfishId"
}

export const getRoutePayerDataPage = () => "/payer-data-page";
export const getRoutePayeeSearchPage = () => "/payee-search-page";
export const getRoutePayPage = () => "/pay-page";
export const getRoutePayeeDataPage = () => "/payee-data-page";
export const getRouteSuccessPage = () => "/success-page";
export const getRoutePayErrorPage = () => "/pay-error-page";
export const getRoutePaymentConfirmationPage = () => "/payment-confirmation-page";
export const getRoutePaymentWaitConfirmation = () => "/payment-wait-confirmation";
export const getRouteGeneralErrorPage = () => "/general-error-page";
export const getRouteCancelPage = () => "/cancel-page";
export const getRoutePaymentInstrument = () => "/payment-instrument";
export const getRoutePaymentNotFound = () => "/payment-not-found";
export const getRoutePayoutNotFound = () => "/payout-not-found";
export const getRoutePaymentsBlowfishId = () => "/payments/:blowfishId";
export const getRoutePayoutsBlowfishId = () => "/payouts/:blowfishId";

export const AppRouteByPathPattern: Record<string, AppRoutes> = {
    [getRoutePayerDataPage()]: AppRoutes.PAYER_DATA_PAGE,
    [getRoutePayeeSearchPage()]: AppRoutes.PAYEE_SEARCH_PAGE,
    [getRoutePayPage()]: AppRoutes.PAY_PAGE,
    [getRoutePayeeDataPage()]: AppRoutes.PAYEE_DATA_PAGE,
    [getRouteSuccessPage()]: AppRoutes.SUCCESS_PAGE,
    [getRoutePayErrorPage()]: AppRoutes.PAY_ERROR_PAGE,
    [getRoutePaymentConfirmationPage()]: AppRoutes.PAYMENT_CONFIRMATION_PAGE,
    [getRoutePaymentWaitConfirmation()]: AppRoutes.PAYMENT_WAIT_CONFIRMATION,
    [getRouteGeneralErrorPage()]: AppRoutes.GENERAL_ERROR_PAGE,
    [getRouteCancelPage()]: AppRoutes.CANCEL_PAGE,
    [getRoutePaymentInstrument()]: AppRoutes.PAYMENT_INSTRUMENT,
    [getRoutePaymentNotFound()]: AppRoutes.PAGE_PAYMENT_NOT_FOUND,
    [getRoutePayoutNotFound()]: AppRoutes.PAGE_PAYOUT_NOT_FOUND,
    [getRoutePaymentsBlowfishId()]: AppRoutes.PAGE_PAYMENTS_BLOWFISH_ID,
    [getRoutePayoutsBlowfishId()]: AppRoutes.PAGE_PAYOUTS_BLOWFISH_ID
};
