import { AppRoutes } from "@/shared/const/router";
import Footer from "@/widgets/Footer";
import Header from "@/widgets/Header";
import { useTranslation } from "react-i18next";
import Loader from "@/shared/ui/Loader";
import { ThreeDsForm } from "@/widgets/ThreeDsForm";

export const ThreeDSPage = () => {
    const { t } = useTranslation("ThreeDsPage");

    return (
        <div className="container">
            <Header />
            <div className="content cardPage">
                <>
                    <h1
                        className="grow"
                        style={{
                            marginBottom: "20px"
                        }}>
                        {t("title")}
                        {/* {"Введите код подтверждения вашего банка"} */}
                    </h1>
                </>
                <ThreeDsForm />
            </div>

            <Footer
                // buttonCaption={!redirectUrl ? t("approve", ns) : t("pay", ns)}
                buttonCaption={"Continue"}
                // buttonCallback={isEcom && redirectUrl ? threeDSCallback : isEcom ? handleSubmit : buttonCallback}
                buttonCallback={() => {}}
                nextPage={AppRoutes.PAYEE_SEARCH_PAGE}
                nextEnabled={true}
                approve={true}
                focused={true}
            />
        </div>
    );
};
