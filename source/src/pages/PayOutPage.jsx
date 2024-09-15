import Header from "../widgets/Header.jsx";
import Footer from "../widgets/Footer.jsx";
import PayoutSubmitModal from "../widgets/PayoutSubmitModal";

import { useContext, useEffect, useMemo, useState } from "react";
import AppContext from "../AppContext.jsx";
import { PleasePay } from "../widgets/PleasePay.jsx";
import { DeadlineInfo } from "../widgets/DeadlineInfo.jsx";
import { PayoutBar } from "../widgets/PayoutBar.jsx";

// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";

const PayOutPage = () => {
  const { BFData, currentPaymentInstrument, t, getCurrencySymbol, supportDialog } =
    useContext(AppContext);

  //translation
  const ns = { ns: ["Common", "PayOut"] };

  const [showPayoutSubmit, setShowPayoutSubmit] = useState(false);
  const [disabledButon, setDisabledButon] = useState(false);
  const [transactionsMock, setTransactiosnMock] = useState([
    {
      status: "approveOne",
      value: 300,
      currency: "₽",
    },
  ]);

  // const currPayMethod = JSON.parse(currentPaymentInstrument);
  // const trader = JSON.parse(traderData);

  // const nav = navigate();

  useMemo(() => {
    const temp = [...transactionsMock];
    const index = temp.findIndex((item) => item.status === "await");

    if (index !== -1) {
      setTimeout(() => {
        const temp = [...transactionsMock];
        temp[index].status = "new";
        setTransactiosnMock(temp);
      }, 3000);

      setTimeout(() => {
        const temp = [...transactionsMock];
        temp[index].status = "approveOne";
        setDisabledButon(false);
        setTransactiosnMock(temp);
      }, 5000);
    }
  }, [transactionsMock]);

  return (
    <div className="container">
      <Header />
      <div className="content">
        <PleasePay
          amount={BFData?.amount}
          currency={getCurrencySymbol(BFData?.currency)}
          payOut={true}
          bank={currentPaymentInstrument?.bank_name}
        />

        <DeadlineInfo bankName={currentPaymentInstrument?.bank_name} />

        <PayoutBar
          transactions={transactionsMock}
          sumAmount={1000}
          awaiting={
            transactionsMock[transactionsMock.length - 1].status === "await"
          }
        />

        <div className="instructions small">
          <ul>
            <h2>{t("dontCloseWindow", ns)}</h2>
            <li>
              <span>1. </span>
              {t("dontCloseSteps.one", ns)}
            </li>
            <li>
              <span>2. </span>
              {t("dontCloseSteps.two", ns)}
            </li>
            <li>
              <span>3. </span>
              {t("dontCloseSteps.three", ns)}
            </li>
          </ul>
        </div>
      </div>

      {showPayoutSubmit && (
        <PayoutSubmitModal
          data={{
            title: `Перевод в размере ${BFData?.amount} ${getCurrencySymbol(
              BFData?.currency
            )} поступил?`,
            text: "Если перевод поступил, включите переключатель инажмите кнопку продолжения.",
            toggleText: "Перевод был сделан",
            primaryBtnText: "Да перевод сделан",
            primaryBtnCallback: () => {
              setDisabledButon(true);
              const temp = [...transactionsMock];
              const index = temp.findIndex(
                (item) => item.status === "approveOne"
              );
              temp[index].status = "approveFull";
              temp.push({ status: "await", value: 100, currency: "₽" });
              setTransactiosnMock(temp);

              setShowPayoutSubmit(false);
            },
            secondaryBtnText: "Еще нет",
          }}
          closeModal={() => setShowPayoutSubmit(false)}
        />
      )}

      <Footer
        approveButton={{
          caption: t("approvePayout", ns),
          disabled: disabledButon,
          callback: () => {
            setShowPayoutSubmit(true);
          },
        }}
        discardButton={{
          caption: t("discardPayout", ns),
          disabled: disabledButon,
          callback: () => {
            supportDialog.setIsActive(true)
          },
        }}
      />
    </div>
  );
};

export default PayOutPage;
