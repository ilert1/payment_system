import * as c from "../assets/constants.js";
import Header from "../widgets/Header";
import Footer from "../widgets/Footer";
import { Timer } from "../ui/Timer";

import { useContext, useState } from "react";
import AppContext from "../AppContext";

import Clock from "../assets/images/clock.svg";
import FileIcon from "../assets/images/file.svg";
import FilePdfIcon from "../assets/images/file-pdf.svg";

import { FileUploader } from "react-drag-drop-files";

const DropZoneContent = () => {
    return (
        <>
            <img className="file-icon" src={FileIcon} alt="" />
            <p id="drop-zone-text">Добавить PDF или скриншот</p>
            <p id="drop-zone-progress-text">0 КБ/26 КБ</p>

            <div className="drop-zone-file">
                <div className="left">
                    <img className="file-type" src={FilePdfIcon} alt="" />
                    <p id="drop-zone-file-name"></p>
                </div>
                <p className="replace-file">Заменить PDF</p>
            </div>
        </>
    );
};

const PaymentConfirmationPage = () => {
    const { navigate, t } = useContext(AppContext);

    //translation
    const ns = { ns: "PaymentConfirmation" };

    const [file, setFile] = useState(null);
    const handleChange = file => {
        setFile(file);
    };

    const fileTypes = ["JPG", "PNG", "GIF"];

    return (
        <div className="container">
            <Header />

            <div className="content">
                <h1 className="grow">Подтверждение оплаты</h1>
                <div className="confirmation-deadline-info">
                    <p className="confirmation-comment">Прикрепите подтверждение оплаты для проверки</p>
                    <div className="deadline-container">
                        <img src={Clock} alt="" />
                        <Timer down={true} className="deadline-timer" secondsToDo={60 * 20} />
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
                nextPage={c.PAGE_PAYMENT_WAIT_CONFIRMATION}
                nextEnabled={file}
            />
        </div>
    );
};

export default PaymentConfirmationPage;
