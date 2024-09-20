import React from "react";

const ChatFile = ({ file }) => {
    return (
        <div className="chat__file">
            <span>
                {file.type == "pdf" && "Файл"}
                {file.type == "video" && "Видео"}
                {file.type == "image" && "Фото"}
            </span>
        </div>
    );
};

export default ChatFile;
