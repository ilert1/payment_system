import Avatar from "../ui/Avatar";

const MessageBlock = ({ name, type, children, block }) => {
    return (
        <>
            {block && (
                <div className="chat__message-block">
                    <Avatar name={name} type={type} me={!block} />
                    {children}
                </div>
            )}
            {!block && children}
        </>
    );
};

export default MessageBlock;
