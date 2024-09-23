/* eslint-disable react/prop-types */
import ChatFile from "../ui/ChatFile";
import MessageBlock from "./MessageBlock";

const Message = ({ message, block }) => {
    const { files, text, type, timestamp } = message;

    const getName = type => {
        switch (type) {
            case "operator":
                return "О";
            case "moderator":
                return "М";
            case "user":
                return "П";
            default:
                return "M";
        }
    };

    const name = getName(type);
    // console.log(files);
    return (
        <>
            <MessageBlock name={name} type={type} block={block}>
                {/* <div className={`chat__message chat__message--${block ? type : "user"}`}> */}
                <div className={`chat__message chat__message--${block ? "notme" : "me"} chat__message--${type}`}>
                    <div className="chat__content">
                        {type === "operator" && block && <h3 className="chat__title">Оператор</h3>}
                        {type === "moderator" && block && <h3 className="chat__title">Модератор</h3>}
                        {type === "user" && block && <h3 className="chat__title">Пользователь</h3>}

                        <div className="chat__files">
                            {files &&
                                files.map((file, index) => {
                                    return <ChatFile key={index} file={file} />;
                                })}
                        </div>

                        <div className="chat__text">{text}</div>

                        <span className="chat__timestamp">{timestamp}</span>
                    </div>
                </div>
            </MessageBlock>
        </>
    );
};

export default Message;
