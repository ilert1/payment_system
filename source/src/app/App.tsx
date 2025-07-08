import "@/shared/assets/css/fonts.css";
import "@/shared/assets/css/styles.css";

import { useEffect } from "react";
import { AppProvider, useAppContext } from "@/AppContext";
import Loader from "@/shared/ui/Loader";
import { ToastContainer } from "react-toastify";
import { AppRouter } from "./providers/router";
import { AppRoutes } from "@/shared/const/router";
import { useBFStore } from "@/shared/store/bfDataStore";

const App = () => {
    const { loading } = useBFStore();
    // const { fingerprintConfig, payoutMode, ym } = useAppContext();

    // useEffect(() => {
    //     const pathname = new URL(window.location.href).pathname;
    //     const blowfishId = pathname.split("/")[2];
    //     const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    //     if (uuidRegex.test(blowfishId)) {
    //         init({ id: blowfishId, payoutMode, fingerprintConfig, ym });
    //     } else {
    //         window.location.replace(
    //             `/${payoutMode ? AppRoutes.PAGE_PAYOUT_NOT_FOUND : AppRoutes.PAGE_PAYMENT_NOT_FOUND}`
    //         );
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    return (
        <>
            {loading ? (
                <div className="container">
                    <div className="content">
                        <div className="loader-container">
                            <Loader />
                        </div>
                    </div>
                </div>
            ) : (
                <AppRouter />
            )}
            <ToastContainer />
        </>
    );
};

export default App;

// {
//     "success": true,
//     "payment": {
//         "id": "bb6eb55f-3351-4729-876e-5d6c9e457bb2",
//         "amount": "11.11",
//         "currency": "UAH",
//         "method": {
//             "name": "",
//             "display_name": "",
//             "payer": null,
//             "payee": null,
//             "context": {
//                 "success_redirect_url": "https://ya.ru",
//                 "error_redirect_url": "https://google.com",
//                 "provider": "PFU2 Provider"
//             }
//         },
//         "status": "paymentAwaitingStart",
//         "created_at": 1751981321
//     }
// }

// https://api.payhub.develop.blowfish.api4ftx.cloud/payments/bb6eb55f-3351-4729-876e-5d6c9e457bb2/events
// {
//     "success": true,
//     "data": {
//         "id": "bb6eb55f-3351-4729-876e-5d6c9e457bb2",
//         "payment_instruments": [
//             {
//                 "bank": "abank",
//                 "bank_name": "ABank",
//                 "payment_type": "card2card",
//                 "payment_type_name": "Card to Card",
//                 "customer_schema": null,
//                 "required": null
//             },
//             {
//                 "bank": "izi",
//                 "bank_name": "izibank",
//                 "payment_type": "card2card",
//                 "payment_type_name": "Card to Card",
//                 "customer_schema": null,
//                 "required": null
//             },
//             {
//                 "bank": "vlasnyirakhunok",
//                 "bank_name": "Bank Vlasnyi Rakhunok",
//                 "payment_type": "card2card",
//                 "payment_type_name": "Card to Card",
//                 "customer_schema": null,
//                 "required": null
//             },
//             {
//                 "bank": "pumb",
//                 "bank_name": "PUMB Bank",
//                 "payment_type": "card2card",
//                 "payment_type_name": "Card to Card",
//                 "customer_schema": null,
//                 "required": null
//             },
//             {
//                 "bank": "creditdnipro",
//                 "bank_name": "Bank Credit Dnipro",
//                 "payment_type": "card2card",
//                 "payment_type_name": "Card to Card",
//                 "customer_schema": null,
//                 "required": null
//             },
//             {
//                 "bank": "mono",
//                 "bank_name": "Monobank",
//                 "payment_type": "card2card",
//                 "payment_type_name": "Card to Card",
//                 "customer_schema": null,
//                 "required": null
//             },
//             {
//                 "bank": "otpbank",
//                 "bank_name": "OTP Bank",
//                 "payment_type": "card2card",
//                 "payment_type_name": "Card to Card",
//                 "customer_schema": null,
//                 "required": null
//             },
//             {
//                 "bank": "creditagricole",
//                 "bank_name": "Credit Agricole",
//                 "payment_type": "card2card",
//                 "payment_type_name": "Card to Card",
//                 "customer_schema": null,
//                 "required": null
//             }
//         ]
//     }
// }

// https://api.payhub.develop.blowfish.api4ftx.cloud/payments/bb6eb55f-3351-4729-876e-5d6c9e457bb2
// {
//     "success": true,
//     "payment": {
//         "id": "bb6eb55f-3351-4729-876e-5d6c9e457bb2",
//         "amount": "11.11",
//         "currency": "UAH",
//         "method": {
//             "name": "card2card",
//             "display_name": "По номеру карты",
//             "bank": {
//                 "name": "bankizi",
//                 "display_name": {
//                     "name_ru": "izibank",
//                     "name_en": "izibank"
//                 }
//             },
//             "payer": {
//                 "schema": {
//                     "type": "object",
//                     "properties": {
//                         "card_holder": {
//                             "type": "string",
//                             "description": "Имя держателя карты",
//                             "format": "cardholderName"
//                         },
//                         "card_last_digits": {
//                             "type": "string",
//                             "description": "Последние 4 цифры номера карты",
//                             "format": "lastFourCardDigits"
//                         }
//                     }
//                 },
//                 "required": null
//             },
//             "payee": {
//                 "schema": {
//                     "type": "object",
//                     "properties": {
//                         "card_holder": {
//                             "type": "string",
//                             "description": "Имя держателя карты",
//                             "format": "cardholderName"
//                         },
//                         "card_number": {
//                             "type": "string",
//                             "description": "Номер карты",
//                             "format": "card_number"
//                         }
//                     }
//                 },
//                 "required": null,
//                 "data": {
//                     "bank_name": "izi",
//                     "card_holder": "Izibank holder",
//                     "card_number": "0000000000000005",
//                     "direction_id": "d6fd74c2-5669-4757-b5bb-3c2a26a8cfff"
//                 }
//             },
//             "context": {
//                 "success_redirect_url": "https://ya.ru",
//                 "error_redirect_url": "https://google.com",
//                 "provider": "PFU2 Provider"
//             }
//         },
//         "status": "paymentAwaitingTransfer",
//         "created_at": 1751981321
//     }
// }
