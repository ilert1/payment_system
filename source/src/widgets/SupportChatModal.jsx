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

const SupportChatModal = ({ disputeNumber = "00032340123", successDispute = () => {}, failedDispute = () => {} }) => {
    const { t } = useContext(AppContext);

    //fallback для payIn на всякий
    /* let payoutMode = null;
    try {
        payoutMode = useContext(AppContext).payoutMode;
    } catch (e) {
        console.log(e);
    } */

    //TODO поменять на глобальный стейт из контекста (выше)
    const [payoutMode, setPayoutMode] = useState(true);

    const ns = { ns: "SupportDialog" };

    const [messages, setMessages] = useState([]);

    /* useEffect(() => {
        if (payoutMode) {
            setTimeout(() => {
                send(messages, {
                    type: "moderator",
                    text: "Добрый день! Вы сообщили, что не получили перевод. Ожидайте, пожалуйста"
                    // files: [{ type: "pdf" }]
                });
            }, 1000);
        }
    }, []); */

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
        let files = [];
        if (isPdfSelected) {
            files.push({ type: "pdf" });
        }
        if (isVideoSelected) {
            files.push({ type: "video" });
        }
        if (inputValue.trim()) {
            setMessages([
                ...messages,
                {
                    type: payoutMode ? "user" : "operator",
                    text: inputValue,
                    files,
                    timestamp: new Date().toLocaleTimeString("ru-RU", { timeStyle: "short" })
                }
            ]);
            setInputValue("");
            setIsPdfSelected(false);
            setIsVideoSelected(false);
            scrollHandler(messagesRef);
        }
    };

    const [show, setShow] = useState(false);
    const [favorState, setFavorState] = useState("success");

    const showPanel = state => {
        setShow(true);
        if (state === "success") setFavorState("success");
        else if (state === "fail") setFavorState("fail");
        else if (state === "repeat") setFavorState("repeat");
        else setShow(false);
        scrollHandler(messagesRef);
        // scrollToBottom();
    };

    useEffect(() => {
        scrollHandler(messagesRef);
    }, [show]);

    useEffect(() => {
        window.showPanel = showPanel;
    }, []);
    const divRef = useRef(null);

    /* const scrollToBottom = () => {
        const div = divRef.current;
        console.log(div);
        if (div) {
            div.scrollTop = div.scrollHeight;
        }
    }; */

    const send = (messages, obj) => {
        // let files = obj.files;
        /* const obj = {
                type: "user",
                text: "шёл бы ты отсюда, петушок",
                files: [{ type: "pdf" }],
            } */

        setMessages([...messages, obj]);
        setInputValue("");
        scrollHandler(messagesRef);
    };

    useEffect(() => {
        scrollHandler(messagesRef);
        window.sendMessage = obj => send(messages, obj);
    }, [, messages]);

    const mockFavor = true;

    return (
        <div className="chat__container" ref={divRef}>
            <div className="chat__header">
                <div className="chat__participants">
                    {payoutMode && <Avatar small={true} name={payoutMode ? "Вы" : "П"} type="user" me={payoutMode} />}
                    <Avatar small={true} name="М" type="moderator" />
                    {!payoutMode && (
                        <Avatar small={true} name={!payoutMode ? "Вы" : "О"} type="operator" me={!payoutMode} />
                    )}
                </div>

                <div
                    className="chat__dispute"
                    onClick={() => {
                        //отладочный стейт
                        // setPayoutMode(prev => !prev);
                        /* sendMessage({
                            type: "user",
                            text: "шёл бы ты отсюда, петушок",
                            files: [{ type: "pdf" }]
                        }); */
                    }}>
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
                                (message.type == "user" && !payoutMode) ||
                                (message.type == "operator" && payoutMode) ||
                                message.type == "moderator"
                            }
                        />
                    );
                })}

                {show && <DisputeLine text={`Диспут ${disputeNumber} закрыт`} show={show} />}
                {show && (
                    <DisputeClosed
                        favor={favorState}
                        buttonHandler={mockFavor ? successDispute : failedDispute}
                        show={show}
                    />
                )}
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
