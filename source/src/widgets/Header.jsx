import SupportDialog from "../widgets/SupportDialog";

import { useContext } from "react";
import AppContext from "../AppContext";

import MessageSquare from "../assets/images/message-square.svg";

import LanguageSelector from "./LanguageSelector";
import ym from "react-yandex-metrika";

const Header = () => {
    const { isActive, setIsActive } = useContext(AppContext).supportDialog;
    const { lang, setLang } = useContext(AppContext);
    const { t } = useContext(AppContext);
    //translation
    const ns = { ns: "Common" };

    return (
        <>
            <header>
                <div
                    className="support-container"
                    onClick={() => {
                        if (import.meta.env.VITE_YMETRICS_COUNTER) {
                            ym("reachGoal", "support-dialog.overlay.active");
                        }
                        setIsActive(!isActive);
                    }}>
                    <img src={MessageSquare} alt="" />
                    {t("support", ns)}
                </div>
                <LanguageSelector lang={lang} setLang={setLang} />
            </header>
            <SupportDialog />
        </>
    );
};

export default Header;
