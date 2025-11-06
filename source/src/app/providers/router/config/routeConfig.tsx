import { RouteObject } from "react-router-dom";
import { GeneralErrorPage } from "@/pages/GeneralErrorPage";
import { MainPage } from "@/pages/MainPage";
import { PayErrorPage } from "@/pages/PayErrorPage";
import { PayPage } from "@/pages/PayPage";
import PayeeDataPage from "@/pages/PayeeDataPage";
import PayeeSearchPage from "@/pages/PayeeSearchPage";
import { PayerDataPage } from "@/pages/PayerDataPage";
import { PaymentConfirmationPage } from "@/pages/PaymentConfirmationPage";
import PaymentInstrumentPage from "@/pages/PaymentInstrument";
import PaymentWaitConfirmation from "@/pages/PaymentWaitConfirmation";
import { SuccessPage } from "@/pages/SuccessPage";
import { ThreeDSPage } from "@/pages/ThreeDSPage";
import { AppRoutes } from "@/shared/const/router";

const defaultPages: RouteObject[] = [
    { path: AppRoutes.PAGE_PAYMENT_INSTRUMENT, element: <PaymentInstrumentPage /> },
    { path: AppRoutes.PAYER_DATA_PAGE, element: <PayerDataPage /> },
    { path: AppRoutes.PAYEE_SEARCH_PAGE, element: <PayeeSearchPage /> },
    { path: AppRoutes.PAY_PAGE, element: <PayPage /> },
    { path: AppRoutes.PAYEE_DATA_PAGE, element: <PayeeDataPage /> },
    { path: AppRoutes.SUCCESS_PAGE, element: <SuccessPage /> },
    { path: AppRoutes.PAYMENT_CONFIRMATION_PAGE, element: <PaymentConfirmationPage /> },
    { path: AppRoutes.PAYMENT_WAIT_CONFIRMATION, element: <PaymentWaitConfirmation /> },
    { path: AppRoutes.PAY_ERROR_PAGE, element: <PayErrorPage /> },
    { path: AppRoutes.GENERAL_ERROR_PAGE, element: <GeneralErrorPage /> },
    { path: AppRoutes.CANCEL_PAGE, element: <GeneralErrorPage cancel={true} /> },
    { path: AppRoutes.PAGE_THREE_DS, element: <ThreeDSPage /> },
    { index: true, element: <MainPage /> }
];

export const routes: RouteObject[] = [
    {
        path: AppRoutes.PAGE_PAYMENT_NOT_FOUND,
        element: <PayErrorPage notFound />
    },
    {
        path: AppRoutes.PAGE_PAYOUT_NOT_FOUND,
        element: <PayErrorPage notFound />
    },
    {
        path: AppRoutes.PAGE_PAYMENTS_BLOWFISH_ID,
        children: defaultPages
    },
    {
        path: AppRoutes.PAGE_PAYOUTS_BLOWFISH_ID,
        children: defaultPages
    },
    {
        path: "*",
        element: <PayErrorPage notFound />
    }
];
