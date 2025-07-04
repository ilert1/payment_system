import Avatar from "@/shared/ui/Avatar";
import { ReactNode } from "react";

interface MessageBlockProps {
    block: MessageType;
    name: "О" | "М" | "П" | "M";
    type: MessageType;
    children: ReactNode;
}

const MessageBlock = (props: MessageBlockProps) => {
    const { block, type, children, name } = props;

    return (
        <>
            {block && (
                <div className="chat__message-block">
                    <Avatar name={name} type={type} me={block} />
                    {children}
                </div>
            )}
            {!block && children}
        </>
    );
};

export default MessageBlock;
