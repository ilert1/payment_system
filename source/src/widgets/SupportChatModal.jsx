/* eslint-disable react/prop-types */
import { useEffect, useRef, useState, useContext } from "react";
import AppContext from "../AppContext";
import ChatSend from "../assets/images/chat-send.svg";
import ChatPaperclip from "../assets/images/chat-paperclip.svg";
import Copy from "../assets/images/copy.svg";
import CheckCircle from "../assets/images/check-circle.svg";
import { DisputeClosed } from "../ui/DisputeClosed";
import PdfFile from "../assets/images/pdf-file.svg";
import VideoFile from "../assets/images/video-818.svg";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Message from "./Message";
import Avatar from "../ui/Avatar";

const DisputeLine = ({ text }) => {
    return (
        <div className="chat__dispute-line">
            <span>{text}</span>
        </div>
    );
};

/* const UserMessage = ({ text, files }) => (
    <div className="chat__message chat__message--user">
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
); */

/* const OperatorMessage = ({ text, files }) => (
    <div className="chat__message-block">
        <Avatar name="О" type="operator" />

        <div className="chat__content chat__message chat__message--operator">
            <div className="chat__files">
                {files &&
                    files.map((file, index) => (
                        <div key={index} className="chat__file">
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
                        </div>
                    ))}
            </div>

            <div className="chat__text">{text}</div>
        </div>
    </div>
); */

/* const ModeratorMessage = ({ text }) => (
    <div className="chat__message-block">
        <Avatar name="М" type="moderator" />
        <div className="chat__content chat__message chat__message--moderator">
            <div className="chat__text">{text}</div>
        </div>
    </div>
); */

const SupportChatModal = ({ disputeNumber = "00032340123", successDispute = () => {}, failedDispute = () => {} }) => {
    const { t } = useContext(AppContext);

    let payoutMode = null;
    try {
        payoutMode = useContext(AppContext).payoutMode;
    } catch (e) {
        console.log(e);
    }

    const ns = { ns: "SupportDialog" };

    const [messages, setMessages] = useState([
        {
            text: "Ща все решим не ссы",
            type: "moderator",
            files: []
        },
        {
            text: "Я все скинул!!!",
            type: "operator",
            files: [{ type: "video" }, { type: "image" }, { type: "pdf" }]
        },
        {
            text: "Пиздун",
            type: "user",
            files: [{ type: "video" }, { type: "image" }, { type: "pdf" }]
        },
        {
            text: "Сам пиздун",
            type: "moderator",
            files: []
        },
        {
            text: "Ща все решим не ссы",
            type: "moderator",
            files: []
        },
        {
            text: "Я все скинул!!!",
            type: "operator",
            files: [{ type: "video" }, { type: "image" }, { type: "pdf" }]
        },
        {
            text: "Пиздун",
            type: "user",
            files: [{ type: "video" }, { type: "image" }]
        },
        {
            text: "Сам пиздун",
            type: "moderator",
            files: []
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const messagesRef = useRef();

    let popupTimeout = null;

    const showPopupCallback = () => {
        clearTimeout(popupTimeout);
        setShowPopup(true);

        popupTimeout = setTimeout(() => {
            setShowPopup(false);
        }, 1000);
    };

    const scrollHandler = ref => {
        ref.current.scrollTo({
            top: 1000000,
            left: 0,
            behavior: "smooth"
        });
    };

    const [isPdfSelected, setIsPdfSelected] = useState(false);
    const [isVideoSelected, setIsVideoSelected] = useState(false);
    const videoTypes = ["video/mp4", "video/mov", "video/quicktime", "video/mpeg"];
    const fileInputRef = useRef(null);

    const handleFileSelection = event => {
        setIsPdfSelected(false);
        setIsVideoSelected(false);
        const file = event.target.files[0];
        if (file && file.type === "application/pdf") {
            setIsPdfSelected(true);
        } else if (file && videoTypes.includes(file.type)) {
            setIsVideoSelected(true);
        }
    };

    const openFileDialog = () => {
        fileInputRef.current.click();
    };

    const handleSendMessage = () => {
        if (inputValue.trim()) {
            setMessages([...messages, { type: "user", text: inputValue, files: [] }]);
            setInputValue("");
            scrollHandler(messagesRef);
        }
    };

    useEffect(() => {
        scrollHandler(messagesRef);
    }, []);

    const mockFavor = true;

    return (
        <div className="chat__container">
            <div className="chat__header">
                <div className="chat__participants">
                    <Avatar small={true} name={payoutMode ? "Вы" : "П"} type="user" />
                    <Avatar small={true} name="М" type="moderator" />
                    <Avatar small={true} name={!payoutMode ? "Вы" : "О"} type="operator" />
                </div>

                <div className="chat__dispute">
                    Диспут {disputeNumber}
                    <CopyToClipboard text={disputeNumber} onCopy={showPopupCallback}>
                        <button>
                            <img src={Copy} alt="" />
                        </button>
                    </CopyToClipboard>
                    <div id="copy-dialog-popup" className={`popup ${showPopup ? "active" : ""}`}>
                        {t("copyed", ns)}
                        <img src={CheckCircle} alt="" />
                    </div>
                </div>
            </div>

            <div ref={messagesRef} className="chat__messages">
                <DisputeLine text={`Диспут ${disputeNumber} открыт`} />

                {messages.map((message, index) => {
                    return (
                        <Message
                            key={index}
                            message={message}
                            block={
                                (message.type == "user" && payoutMode) ||
                                (message.type == "operator" && !payoutMode) ||
                                message.type == "moderator"
                            }
                        />
                    );
                })}

                <DisputeLine text={`Диспут ${disputeNumber} закрыт`} />

                <DisputeClosed favor={mockFavor} backButtonHandler={mockFavor ? successDispute : failedDispute} />
            </div>

            <div className="chat__input">
                <div className="chat__input-field">
                    <button className="chat__btn-paperclip" onClick={openFileDialog}>
                        <img src={ChatPaperclip} alt="paperclip" />
                    </button>

                    <input ref={fileInputRef} type="file" style={{ display: "none" }} onChange={handleFileSelection} />

                    <input
                        className="chat__input-text"
                        type="text"
                        placeholder="Введите сообщение..."
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === "Enter") {
                                handleSendMessage();
                            }
                        }}
                    />

                    {isPdfSelected && <img src={PdfFile} alt="pdf-icon" className="chat__pdf-icon" />}
                    {isVideoSelected && <img src={VideoFile} alt="pdf-icon" className="chat__pdf-icon" />}
                </div>

                <button className="chat__send-button" onClick={handleSendMessage}>
                    <img src={ChatSend} alt="send" />
                </button>
            </div>
        </div>
    );
};

export default SupportChatModal;
