import { Outlet } from "react-router-dom";
import { useAppContext } from "@/AppContext";
import { PaymentStart } from "@/features/PaymentStart/ui/PaymentStart";
import { usePaymentPage } from "@/shared/hooks/usePaymentPage";
import { useBFStore } from "@/shared/store/bfDataStore";
import Loader from "@/shared/ui/Loader/Loader";
import { Content } from "@/widgets/Content";
import { Footer } from "@/widgets/Footer";
import { Page } from "@/widgets/Page";

export const MainPage = () => {
    const { ym } = useAppContext();
    const BFData = useBFStore(state => state.BFData);

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";

    ym("reachGoal", "main-page", { blowfish_id: BFData?.[dest]?.id });

    usePaymentPage({ absolutePath: true });

    return (
        <Page>
            <Content>{!BFData?.[dest]?.method ? <Loader /> : <PaymentStart />}</Content>
            <Footer />
            <Outlet />
        </Page>
    );
};

export default MainPage;
