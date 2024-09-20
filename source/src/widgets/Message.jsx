import { Avatar } from "./SupportChatModal";

const Message = ({ message }) => {
    console.log(message);

    const { files = [], text = "", type = "moderator" } = message;

    return (
        <div className={`chat__message chat__message--${type}`}>
            <Avatar
                name={() => {
                    switch (type) {
                        case "operator":
                            return "О";
                            break;
                        case "moderator":
                            return "М";
                            break;
                        case "user":
                            return "П";
                            break;
                        default:
                            return "M";
                    }
                }}
                type={type}
            />
            <div className="chat__content">
                <div className="chat__files">
                    {files &&
                        files.map((file, index) => (
                            <div key={index} className="chat__file">
                                <span>
                                    {(() => {
                                        switch (file.type) {
                                            case "image":
                                                return "🖼 Фото";
                                            case "pdf":
                                                return "📄 Файл";
                                            default:
                                                return "📹 Видео";
                                        }
                                    })()}
                                </span>
                            </div>
                        ))}
                </div>

                <div className="chat__text">{text}</div>
            </div>
        </div>
    );
};

export default Message;
