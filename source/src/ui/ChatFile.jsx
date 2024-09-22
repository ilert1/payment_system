import React from "react";
import PlayCircle from "../assets/images/play-circle.svg";
import ImageIcon from "../assets/images/image.svg";
import FileIcon from "../assets/images/file-icon.svg";

const ChatFile = ({ file }) => {
    return (
        <div className="chat__file">
            {file.type == "pdf" && (
                <>
                    <img src={FileIcon} alt="" />
                    <span>Файл</span>
                </>
            )}
            {file.type == "video" && (
                <>
                    <img src={PlayCircle} alt="" />
                    <span>Видео</span>
                </>
            )}
            {file.type == "image" && (
                <>
                    <img src={ImageIcon} alt="" />
                    <span>Фото</span>
                </>
            )}
        </div>
    );
};

export default ChatFile;
