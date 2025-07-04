import React from "react";
import PlayCircle from "../assets/images/play-circle.svg?react";
import ImageIcon from "../assets/images/image.svg?react";
import FileIcon from "../assets/images/file-icon.svg?react";

interface ChatFileProps {
    file: any;
}

const ChatFile = ({ file }: ChatFileProps) => {
    return (
        <div className="chat__file">
            {file.type == "pdf" && (
                <>
                    {/* <img src={FileIcon} alt="" /> */}
                    <FileIcon />
                    <span>Файл</span>
                </>
            )}
            {file.type == "video" && (
                <>
                    {/* <img src={PlayCircle} alt="" /> */}
                    <PlayCircle />
                    <span>Видео</span>
                </>
            )}
            {file.type == "image" && (
                <>
                    {/* <img src={ImageIcon} alt="" /> */}
                    <ImageIcon />
                    <span>Фото</span>
                </>
            )}
        </div>
    );
};

export default ChatFile;
