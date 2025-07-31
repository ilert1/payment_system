import Header from "../widgets/Header";
import Footer from "../widgets/Footer";

import { Loader } from "../shared/ui/Loader";
import { Timer } from "../shared/ui/Timer";

import usePaymentPage from "../hooks/usePaymentPage";
import { useAppContext } from "../AppContext";
import { useBFStore } from "@/shared/store/bfDataStore";

const PayeeDataPage = () => {
    const { t, getCurrencySymbol, ym } = useAppContext();
    const BFData = useBFStore(state => state.BFData);

    //translation
    const ns = { ns: "PayeeData" };
    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";

    usePaymentPage({ absolutePath: false });

    const redirect = (url: string) => {
        window.location.replace(url);
    };

    const buttonCallback = () => {
        ym("reachGoal", "back-return-button", {
            back_redirect_url: BFData?.[dest]?.method?.context?.back_redirect_url
        });
        redirect(BFData?.[dest]?.method?.context?.back_redirect_url ?? "");
    };

    return (
        <div className="container">
            <Header />

            <div className="content">
                <div className="header-container grow">
                    <h1>
                        {t("waitConfirmation", ns)} {BFData?.[dest]?.amount}&nbsp;
                        {getCurrencySymbol(BFData?.[dest]?.currency ?? "")}
                    </h1>
                </div>
                <div className="description low-mb low-mt">
                    <p>{t("waitComment", ns)}</p>
                </div>
                <div className="loader-container">
                    <Loader />
                    <Timer />
                    <p className="status-comment">{t("waitTime", ns)}</p>
                </div>
            </div>

            <Footer
                buttonCallback={BFData?.[dest]?.method?.context?.back_redirect_url ? buttonCallback : () => {}}
                buttonCaption={BFData?.[dest]?.method?.context?.back_redirect_url ? t("backToSite", ns) : ""}
                nextPage={BFData?.[dest]?.method?.context?.back_redirect_url}
                payeeCard={true}
                showCancelBtn={false}
                hideRequisite={
                    BFData?.[dest]?.method?.payee?.data?.phone_number && BFData?.[dest]?.currency === "RUB"
                        ? true
                        : false
                }
            />
        </div>
    );
};

export default PayeeDataPage;
