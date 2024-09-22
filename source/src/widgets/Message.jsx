import Avatar from "../ui/Avatar";
import ChatFile from "../ui/ChatFile";
import MessageBlock from "./MessageBlock";

const Message = ({ message, block }) => {
    const { files, text, type } = message;

    const getName = type => {
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
    };

    const name = getName(type);
    // console.log(files);
    return (
        <>
            <MessageBlock name={name} type={type} block={block}>
                {/* <div className={`chat__message chat__message--${block ? type : "user"}`}> */}
                <div className={`chat__message chat__message--${block ? "notme" : "me"} chat__message--${type}`}>
                    <div className="chat__content">
                        <div className="chat__files">
                            {files &&
                                files.map((file, index) => {
                                    return <ChatFile key={index} file={file} />;
                                })}
                        </div>

                        <div className="chat__text">{text}</div>
                    </div>
                </div>
            </MessageBlock>
        </>
    );
};

export default Message;
