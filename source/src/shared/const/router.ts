export enum AppRoutes {
    MAIN = "main",
    PAYMENT_METHODS = "payment-methods",
    PAYER_DATA_PAGE = "payer-data-page",
    PAYEE_SEARCH_PAGE = "payee-search-page",
    PAY_PAGE = "pay-page",
    PAYEE_DATA_PAGE = "payee-data-page",
    SUCCESS_PAGE = "success-page",
    PAY_ERROR_PAGE = "pay-error-page",
    PAYMENT_CONFIRMATION_PAGE = "payment-confirmation-page",
    PAYMENT_WAIT_CONFIRMATION = "payment-wait-confirmation",
    GENERAL_ERROR_PAGE = "general-error-page",
    CANCEL_PAGE = "cancel-page"
}

export const getRouteMain = () => "/";
export const getRoutePaymentMethods = () => "/payment-methods";
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

export const AppRouteByPathPattern: Record<string, AppRoutes> = {
    [getRouteMain()]: AppRoutes.MAIN,
    [getRoutePaymentMethods()]: AppRoutes.PAYMENT_METHODS,
    [getRoutePayerDataPage()]: AppRoutes.PAYER_DATA_PAGE,
    [getRoutePayeeSearchPage()]: AppRoutes.PAYEE_SEARCH_PAGE,
    [getRoutePayPage()]: AppRoutes.PAY_PAGE,
    [getRoutePayeeDataPage()]: AppRoutes.PAYEE_DATA_PAGE,
    [getRouteSuccessPage()]: AppRoutes.SUCCESS_PAGE,
    [getRoutePayErrorPage()]: AppRoutes.PAY_ERROR_PAGE,
    [getRoutePaymentConfirmationPage()]: AppRoutes.PAYMENT_CONFIRMATION_PAGE,
    [getRoutePaymentWaitConfirmation()]: AppRoutes.PAYMENT_WAIT_CONFIRMATION,
    [getRouteGeneralErrorPage()]: AppRoutes.GENERAL_ERROR_PAGE,
    [getRouteCancelPage()]: AppRoutes.CANCEL_PAGE
};
