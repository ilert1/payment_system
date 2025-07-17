interface AvatarProps {
    name: string;
    small?: boolean;
    type?: string;
    me?: MessageType;
}

export const Avatar = (props: AvatarProps) => {
    const { name, small = false, type = "", me = "moderator" } = props;

    let cn = `chat__avatar--${me ? "me" : "notme"} `;
    if (type == "moderator") {
        cn = "chat__avatar--moderator-type";
    }

    return (
        <>
            <span className={"chat__avatar " + (small ? "chat__avatar--small " : "") + cn}>{name}</span>
        </>
    );
};

export default Avatar;
