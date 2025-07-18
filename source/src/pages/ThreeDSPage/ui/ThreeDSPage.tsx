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
                <ThreeDsForm />
                <>
                    <h1 className="grow">{t("title")}</h1>
                    {/* <CardNumberForm disabled={isPressed || isFetching} cardHolderVisible={showCardHolder} /> */}
                </>
                {/* {isEcom ? (
                    !isFetching && !waitTransfer ? (
                        <>
                            <h1 className="grow">{t("enterYourCard", ns)}</h1>
                            <CardNumberForm disabled={isPressed || isFetching} cardHolderVisible={showCardHolder} />
                        </>
                    ) : (
                        <>
                            <h1 className="grow">{t("getCard", ns)}</h1>
                            {(isPressed || isFetching) && (
                                <div className="loader-container">
                                    <Loader />
                                </div>
                            )}
                        </>
                    )
                ) : (
                    <>
                        <h1 className="grow">{`${t("enter4", ns)} ${
                            isSbp ? t("yourPhone", ns) : t("yourCard", ns)
                        }`}</h1>
                        <CardNumberLast4 onComplete={onComplete} showHidden={!isSbp} />
                    </>
                )} */}
            </div>
            {/* {!isFetching && (
                <Footer
                    buttonCaption={!redirectUrl ? t("approve", ns) : t("pay", ns)}
                    buttonCallback={isEcom && redirectUrl ? threeDSCallback : isEcom ? handleSubmit : buttonCallback}
                    nextPage={AppRoutes.PAYEE_SEARCH_PAGE}
                    nextEnabled={nextEnabled}
                    approve={true}
                    focused={buttonFocused}
                />
            )} */}
        </div>
    );
};
