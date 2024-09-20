export const Avatar = ({ name, small = false, type = "" }) => {
    const switchType = type => {
        switch (type) {
            case "user":
                return "chat__avatar--user-type";
            case "operator":
                return "chat__avatar--operator-type";
            case "moderator":
                return "chat__avatar--moderator-type";
            default:
                return "";
        }
    };

    return (
        <>
            <span className={"chat__avatar " + (small ? "chat__avatar--small " : "") + switchType(type)}>{name}</span>
        </>
    );
};

export default Avatar;
