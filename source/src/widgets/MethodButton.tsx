interface MethodButtonProps {
    methodLogo: string;
    methodName: string;
    onClick: () => void;
    active: boolean;
}

const MethodButton = (props: MethodButtonProps) => {
    const { methodLogo, methodName, onClick, active } = props;

    return (
        <div
            className={`method-button ${active ? "active" : ""}`}
            onClick={() => {
                onClick();
            }}>
            <div className="left">
                <img src={methodLogo} alt="" />
                <p className="method-name">{methodName}</p>
            </div>
            <div className="right">
                <img src="/src/assets/images/arrow-blue.svg" alt="" />
            </div>
        </div>
    );
};

export default MethodButton;
