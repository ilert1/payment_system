export const Avatar = ({ name, small = false, type = "", me = "moderator" }) => {
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
