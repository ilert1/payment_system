import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { useAppContext } from "@/AppContext";
import FilePdfIcon from "@/shared/assets/images/file-pdf.svg";
import FileIcon from "@/shared/assets/images/file.svg";
import { AppRoutes } from "@/shared/const/router";
import { DeadLineTimer } from "@/shared/ui/DeadlineTimer/DeadLineTimer";
import { Text } from "@/shared/ui/Text/Text";
import { Footer } from "@/widgets/Footer";
import { Page } from "@/widgets/Page";
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

    const [file, setFile] = useState(null);

    const handleChange = (file: any) => {
        setFile(file);
    };

    const fileTypes = ["JPG", "PNG", "GIF"];

    return (
        <Page>
            <div className="content">
                <Text size="l" title={"Подтверждение оплаты"} grow />
                <div className={styles.confirmationDeadlineInfo}>
                    <p>Прикрепите подтверждение оплаты для проверки</p>
                    <DeadLineTimer timerSecondsTo={60 * 15} timerCallback={() => {}} />
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
        </Page>
    );
};
