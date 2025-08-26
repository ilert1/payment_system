import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { useAppContext } from "@/AppContext";
import Clock from "@/shared/assets/images/clock.svg";
import FilePdfIcon from "@/shared/assets/images/file-pdf.svg";
import FileIcon from "@/shared/assets/images/file.svg";
import { AppRoutes } from "@/shared/const/router";
import { Timer } from "@/shared/ui/Timer";
import { Footer } from "@/widgets/Footer";
import { Header } from "@/widgets/Header";
import styles from "./PaymentConfirmationPage.module.scss";

const DropZoneContent = () => {
    return (
        <>
            <img className="file-icon" src={FileIcon} alt="" />
            <p className={styles.dropZoneText}>Добавить PDF или скриншот</p>
            <p className={styles.dropZoneProgressText}>0 КБ/26 КБ</p>

            <div className={styles.dropZoneFile}>
                <div className={styles.dropZoneFileLeft}>
                    <img src={FilePdfIcon} alt="" />
                </div>
                <p className={styles.replaceFile}>Заменить PDF</p>
            </div>
        </>
    );
};

export const PaymentConfirmationPage = () => {
    const { t } = useAppContext();

    //translation
    const ns = { ns: "PaymentConfirmation" };

    const [file, setFile] = useState(null);

    const handleChange = (file: any) => {
        setFile(file);
    };

    const fileTypes = ["JPG", "PNG", "GIF"];

    return (
        <div className="container">
            <Header />

            <div className="content">
                <h1 className="grow">Подтверждение оплаты</h1>
                <div className={styles.confirmationDeadlineInfo}>
                    <p className="confirmation-comment">Прикрепите подтверждение оплаты для проверки</p>
                    <div className="deadline-container">
                        <img src={Clock} alt="" />
                        <Timer down={true} className="deadline-timer" secondsToDo={60 * 15} />
                    </div>
                </div>

                <FileUploader
                    handleChange={handleChange}
                    name="file"
                    types={fileTypes}
                    // label="Добавить PDF или скриншот"
                    hoverTitle=" " //"Перетащите файл сюда"
                    dropMessageStyle={{ backgroundColor: "#37a8f3" }}
                    classes="drop-zone"
                    onTypeError={() => {
                        alert(
                            `Данный тип файла не поддерживается! Пожалуйста загрузите файл в формате ${fileTypes.join(
                                ","
                            )}`
                        );
                    }}
                    children={<DropZoneContent />}
                />
                {/* <div id="drop-zone" className="drop-zone"></div> */}
            </div>

            <Footer
                buttonCaption={t("Common.approve")}
                approve={true}
                nextPage={AppRoutes.PAYMENT_WAIT_CONFIRMATION}
                nextEnabled={!!file}
            />
        </div>
    );
};
