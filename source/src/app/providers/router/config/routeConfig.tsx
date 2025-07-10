import PaymentInstrumentPage from "@/pages/PaymentInstrumentPage";
import { PayerDataPage } from "@/pages/PayerDataPage";
import PayeeSearchPage from "@/pages/PayeeSearchPage";
import PayeeDataPage from "@/pages/PayeeDataPage";
import SuccessPage from "@/pages/SuccessPage";
import PayErrorPage from "@/pages/PayErrorPage";
import {
    getRoutePaymentInstrument,
    getRoutePayerDataPage,
    getRoutePayeeSearchPage,
    getRoutePayPage,
    getRoutePayeeDataPage,
    getRouteSuccessPage,
    getRoutePayErrorPage,
    getRoutePaymentConfirmationPage,
    getRoutePaymentWaitConfirmation,
    getRouteGeneralErrorPage,
    getRouteCancelPage,
    getRoutePaymentNotFound,
    getRoutePayoutNotFound,
    getRoutePaymentsBlowfishId,
    getRoutePayoutsBlowfishId
} from "@/shared/const/router";
import { RouteProps } from "react-router-dom";
import PaymentConfirmationPage from "@/pages/PaymentConfirmationPage";
import PaymentWaitConfirmation from "@/pages/PaymentWaitConfirmation";
import GeneralErrorPage from "@/pages/GeneralErrorPage";
import MainPage from "@/pages/MainPage";
import { PayPage } from "@/pages/PayPage";

const commonRoutes: RouteProps[] = [
    { path: getRoutePaymentInstrument(), element: <PaymentInstrumentPage /> },
    { path: getRoutePayerDataPage(), element: <PayerDataPage /> },
    { path: getRoutePayeeSearchPage(), element: <PayeeSearchPage /> },
    { path: getRoutePayPage(), element: <PayPage /> },
    { path: getRoutePayeeDataPage(), element: <PayeeDataPage /> },
    { path: getRouteSuccessPage(), element: <SuccessPage /> },
    { path: getRoutePaymentConfirmationPage(), element: <PaymentConfirmationPage /> },
    { path: getRoutePaymentWaitConfirmation(), element: <PaymentWaitConfirmation /> },
    { path: getRoutePayErrorPage(), element: <PayErrorPage /> },
    { path: getRouteGeneralErrorPage(), element: <GeneralErrorPage /> },
    { path: getRouteCancelPage(), element: <GeneralErrorPage cancel={true} /> }
];

export const routeConfig: Record<string, RouteProps> = {
    ...commonRoutes.reduce((acc, route) => {
        acc[getRoutePaymentsBlowfishId() + route.path] = {
            path: getRoutePaymentsBlowfishId() + route.path,
            element: route.element
        };
        acc[getRoutePayoutsBlowfishId() + route.path] = {
            path: getRoutePayoutsBlowfishId() + route.path,
            element: route.element
        };
        return acc;
    }, {} as Record<string, RouteProps>),
    [getRoutePaymentsBlowfishId()]: { path: getRoutePaymentsBlowfishId(), element: <MainPage /> },
    [getRoutePayoutsBlowfishId()]: { path: getRoutePayoutsBlowfishId(), element: <MainPage /> },

    [getRoutePaymentNotFound()]: { path: getRoutePaymentNotFound(), element: <PayErrorPage notFound /> },
    [getRoutePayoutNotFound()]: { path: getRoutePayoutNotFound(), element: <PayErrorPage notFound /> },
    ["*"]: { path: "*", element: <PayErrorPage notFound /> }
};
