import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import fileTypeChecker from "file-type-checker";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFilePicker } from "use-file-picker";
import { useAppContext } from "@/AppContext";
import usePaymentPage from "@/hooks/usePaymentPage";
import { getLocalBankName } from "@/shared/config/i18n/Localization";
import { AppRoutes } from "@/shared/const/router";
import { useBFStore } from "@/shared/store/bfDataStore";
import { FilePicker } from "@/shared/ui/FilePicker/filePicker";
import Loader from "@/shared/ui/Loader";
import { Footer } from "@/widgets/Footer";
import Header from "@/widgets/Header";
import PayHeader from "@/widgets/PayHeader";
import PayeeData from "@/widgets/PayeeData";
import { PaymentInstructions } from "./PaymentInstructions";

const azn = "azn";
const tjs = "tjs";
const iban = "iban";
const abh = "abh";

const PayPage = () => {
    const { fingerprintConfig, t, getCurrencySymbol, caseName, setCaseName, lang, ym } = useAppContext();
    const BFData = useBFStore(state => state.BFData);
    const setBfData = useBFStore(state => state.setBfData);
    const nav = useNavigate();
    //translation
    const ns = { ns: ["Common", "Pay"] };

    usePaymentPage({ absolutePath: false });

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";
    const baseApiURL = import.meta.env.VITE_API_URL;

    const method = BFData?.[dest]?.method;
    const trader = method?.payee?.data;
    const isConfirmTypeFile = method?.context?.confirm_type === "file";
    console.log("confirm_type: ", method?.context?.confirm_type);

    //Критерий уникализации суммы (на всякий случай сделал проверку на наличие original_amount, мало ли будут кейсы без него или он будет нулевой, чтобы не показался popup)
    const isUnicalization =
        BFData?.[dest]?.original_amount && BFData?.[dest]?.original_amount !== "0"
            ? BFData?.[dest]?.original_amount !== BFData?.[dest]?.amount
            : false;

    const [needRefreshBFData, setNeedRefreshBFData] = useState(false);

    const transgran = ["tsbp", "tcard2card"].includes(method?.name ?? "");

    const [requisite, setRequisite] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
    const [bankName, setBankName] = useState("");

    const [buttonCallbackEnabled, setButtonCallbackEnabled] = useState(false);

    const { isFetching: isFetching_ButtonCallback } = useQuery({
        queryKey: ["buttonCallback"],
        enabled: buttonCallbackEnabled,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const fileToBase64 = (file: File | null): Promise<string> => {
                if (file)
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = () => resolve(reader.result as string);
                        reader.onerror = reject;
                    });
                return new Promise((resolve, reject) => resolve(""));
            };
            let pureBase64: string | null = null;
            if (isConfirmTypeFile) {
                const base64Data = await fileToBase64(selectedFile ?? null);
                pureBase64 = base64Data.split(",")[1];
            }

            try {
                const { data } = await axios.post(
                    `${baseApiURL}/${dest}s/${BFData?.[dest]?.id}/events`,
                    {
                        event: "paymentPayerConfirm",
                        ...(isConfirmTypeFile
                            ? {
                                  payload: {
                                      attachment: {
                                          type: "confirm",
                                          format: selectedFile?.type,
                                          data: pureBase64
                                      }
                                  }
                              }
                            : {})
                    },
                    fingerprintConfig
                );

                if (!data.success) {
                    throw new Error(data.error);
                }

                return data;
            } catch (e) {
                toast.error(t("check_load_errors.generalError", ns), {
                    closeButton: <></>,
                    autoClose: 2000
                });
            } finally {
                setButtonCallbackEnabled(false);
            }
        }
    });

    useEffect(() => {
        console.log(`trader`);
        console.log(trader);

        if (!trader) {
            console.log("needRefreshBFData: true");
            setNeedRefreshBFData(true);
        } else {
            setNeedRefreshBFData(false);
        }
    }, [, trader]);

    useEffect(() => {
        if (trader?.card_number) {
            setRequisite(trader.card_number);
        }
        if (trader?.phone) {
            setRequisite(trader.phone);
        }

        if (
            trader?.phone_number &&
            !(BFData?.[dest]?.currency == "RUB" && BFData?.[dest]?.method?.payee?.redirect_url)
        ) {
            setRequisite(trader.phone_number);
        }
        if (trader?.account_number) {
            setRequisite(trader.account_number);
        }
        if (trader?.iban_number) {
            setRequisite(trader.iban_number);
        }
        console.log(trader);
    }, [trader]);

    useEffect(() => {
        setBankName(getLocalBankName(method?.bank?.display_name, lang));
    }, [, method?.bank?.display_name, lang]);

    useEffect(() => {
        setCaseName("");

        console.log(`bankName: ${bankName}`);
        const traderBankName = trader?.bank_name;
        //AZN case check
        if (
            traderBankName &&
            [
                "otherbankaz",
                "mpay",
                "kapitalbank",
                "emanat",
                "leobank",
                "unibank",
                "rabita",
                "abb",
                "birbank",
                "atb",
                "m10",
                "bankofbaku",
                "akart",
                "xalqbank",
                "abbbank",
                "expressbank",
                "express24"
            ].includes(traderBankName)
        ) {
            setCaseName(azn);
            console.log(`caseName: azn`);
        }

        //TJS case check
        if (
            traderBankName &&
            [
                "tcell",
                "babilon-m",
                "megafon",
                "kortimilli",
                "sanduk",
                "ibt",
                "matin",
                "arvand",
                "favri.cbt",
                "oriyonbonk",
                "vasl",
                "amonatbonk",
                "eskhata",
                "tawhidbank",
                "spitamenbank",
                "dushanbe",
                "alif",
                "humo"
            ].includes(traderBankName)
        ) {
            setCaseName(tjs);
            console.log(`caseName: tjs`);
        }

        //ABH case check
        if (traderBankName && ["a-mobile"].includes(traderBankName)) {
            setCaseName(abh);
            setActiveAccordion(1);
            console.log(`caseName: abh`);
        }

        if (traderBankName && trader?.iban_number) {
            setCaseName(iban);
            console.log(`caseName: iban`);
        }
    }, [BFData?.[dest]?.currency, bankName, trader]);

    const { isFetching: isFetching_BFData } = useQuery({
        queryKey: ["exist"],
        // refetchInterval: BFData?.[dest]?.status === "paymentAwaitingStart" ? 1000 : false,
        enabled: needRefreshBFData,
        // refetchIntervalInBackground: true,
        // retry: false,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_API_URL}/${dest}s/${BFData?.[dest]?.id}`,
                    fingerprintConfig
                );

                if (data) {
                    if (data?.success) {
                        //данные получены успешно
                        console.log("setBFData");
                        setBfData(data);
                    } else {
                        //транзакция не найдена или не подлежит оплате
                        console.log(data?.error);
                        setNeedRefreshBFData(false);
                        nav(`/${payOutMode ? AppRoutes.PAGE_PAYOUT_NOT_FOUND : AppRoutes.PAGE_PAYMENT_NOT_FOUND}`);
                    }
                }
                return data;
            } catch (e: any) {
                console.error(e.response.statusCode);
                if (e.response.statusCode === 404) {
                    nav(`/${payOutMode ? AppRoutes.PAGE_PAYOUT_NOT_FOUND : AppRoutes.PAGE_PAYMENT_NOT_FOUND}`);
                }
            } finally {
                setNeedRefreshBFData(false);
            }
        }
    });

    const nextPage = `../${AppRoutes.PAYEE_DATA_PAGE}`;

    const { openFilePicker, loading } = useFilePicker({
        accept: [".png", ".jpg", ".jpeg", ".pdf"],
        multiple: false,
        readAs: "DataURL",
        onFilesSuccessfullySelected: async files => {
            const file = files.plainFiles[0];

            console.log("file", file);

            if (file.size > 3 * 1024 * 1024) {
                setSelectedFile(null);
                toast.error(t("check_load_errors.fileSize", ns));
                ym("reachGoal", "file-rejected", {
                    reason: "size",
                    file: {
                        name: file?.name,
                        size: file?.size,
                        type: file?.type
                    }
                });
                return;
            }

            if (!(file.type.startsWith("image/") || file.type.includes("pdf"))) {
                setSelectedFile(null);
                toast.error(t("check_load_errors.fileType", ns));
                ym("reachGoal", "file-rejected", {
                    reason: "type",
                    file: {
                        name: file?.name,
                        size: file?.size,
                        type: file?.type
                    }
                });
                return;
            }

            ym("reachGoal", "file-selected", {
                file: {
                    name: file?.name,
                    size: file?.size,
                    type: file?.type
                }
            });

            setSelectedFile(file);
        },
        onFilesRejected: () => {
            setSelectedFile(null);
        }
    });

    return (
        <div className="container">
            <Header />
            {!trader || isFetching_BFData ? (
                <div className="content">
                    <div className="loader-container">
                        <Loader />
                    </div>
                </div>
            ) : (
                <>
                    <div className="content">
                        <PayHeader
                            amount={BFData?.[dest]?.amount ?? ""}
                            currency={getCurrencySymbol(BFData?.[dest]?.currency ?? "")}
                            bankName={bankName}
                            countryName={[tjs, azn, abh].includes(caseName) ? caseName : ""}
                            transgran={transgran}
                            timestamp={BFData?.[dest]?.created_at ?? 0}
                        />

                        <PaymentInstructions
                            caseName={caseName}
                            transgran={transgran}
                            trader={trader}
                            bankName={bankName}
                            dest={dest}
                            getCurrencySymbol={getCurrencySymbol}
                            t={t}
                            ns={ns}
                            activeAccordion={activeAccordion}
                            setActiveAccordion={setActiveAccordion}
                        />

                        <PayeeData
                            requisite={requisite ?? ""}
                            trader={trader}
                            bankName={bankName}
                            isPhone={!!trader?.phone || !!trader?.phone_number}
                            caseName={caseName}
                            countryName={[tjs, azn, abh].includes(caseName) ? caseName : ""}
                            transgran={transgran}
                        />
                    </div>
                    {selectedFile && (
                        <FilePicker
                            value={selectedFile}
                            onChange={setSelectedFile}
                            openFilePicker={openFilePicker}
                            loading={loading}
                            label={t("changeCheck", ns)}
                        />
                    )}

                    <Footer
                        buttonCaption={
                            !isConfirmTypeFile
                                ? t("approveTransfer", ns)
                                : selectedFile
                                  ? t("approveTransfer", ns)
                                  : t("selectFile", ns)
                        }
                        buttonCallback={
                            !isConfirmTypeFile
                                ? () => {
                                      setButtonCallbackEnabled(true);
                                  }
                                : selectedFile
                                  ? () => {
                                        setButtonCallbackEnabled(true);
                                    }
                                  : () => openFilePicker()
                        }
                        nextPage={nextPage}
                        nextEnabled={!isFetching_ButtonCallback}
                        approve={true}
                        isUnicalization={isUnicalization}
                    />
                </>
            )}
        </div>
    );
};

export default PayPage;
