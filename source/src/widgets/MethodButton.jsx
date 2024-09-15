const MethodButton = ({ methodLogo, methodName, onClick, active }) => {
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
