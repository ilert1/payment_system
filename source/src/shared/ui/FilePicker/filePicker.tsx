import { useFilePicker } from "use-file-picker";
import FileImageIcon from "@/shared/assets/images/image.svg?react";
import PdfFileIcon from "@/shared/assets/images/file-pdf.svg?react";
import React from "react";
import styles from "./filePicker.module.scss";
import { classNames } from "@/shared/lib/classNames";

interface FilePickerProps {
    value: File | null;
    onChange: (file: File | null) => void;
    label?: string;
    disabled?: boolean;
    openFilePicker: () => void;
    loading: boolean;
}

export const FilePicker: React.FC<FilePickerProps> = ({
    value,
    onChange,
    label = "Выбрать файл",
    disabled = false,
    openFilePicker,
    loading
}) => {
    const renderIcon = () => {
        if (!value) return null;

        const isImage = value.type.startsWith("image/");
        const isPDF = value.type === "application/pdf";

        if (isImage) return <FileImageIcon className={styles.file_picker_icons} />;
        if (isPDF) return <PdfFileIcon className={styles.file_picker_icons} />;
        return null;
    };

    return (
        <div className={classNames(styles.file_picker_container, { [styles.container_selected]: !value })}>
            {loading && <div>Loading</div>}

            {value && (
                <div className={styles.icon_box}>
                    {renderIcon()}
                    <span className={styles.file_name}>{value.name}</span>
                </div>
            )}

            <button
                onClick={() => openFilePicker()}
                disabled={disabled}
                className={classNames(styles.file_picker_button, {
                    [styles.selected]: !value
                })}>
                {label}
            </button>
        </div>
    );
};
