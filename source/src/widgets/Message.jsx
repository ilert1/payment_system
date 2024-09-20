import Avatar from "../ui/Avatar";
import ChatFile from "../ui/ChatFile";

const Message = ({ message }) => {
    console.log(message);

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

    return (
        <>
            <div className={`chat__message chat__message--${type}`}>
                <Avatar name={getName(type)} type={type} />
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
        </>
    );
};

export default Message;
