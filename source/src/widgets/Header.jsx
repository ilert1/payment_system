import SupportDialog from "../widgets/SupportDialog";
import { useState } from "react";

import { useContext } from "react";
import AppContext from "../AppContext";

import PayHubLogo from "../assets/images/Pay_n_Play.svg";
import MessageSquare from "../assets/images/message-square.svg";
import LanguageSelector from "./LanguageSelector";

const Header = () => {
    const { isActive, setIsActive } = useContext(AppContext).supportDialog;
    const { lang, setLang } = useContext(AppContext);
    const { t } = useContext(AppContext);

    // console.log("lang");
    // console.log(langShort);

    //translation
    const ns = { ns: "Common" };

    return (
        <>
            <header>
                <div className="logo-container">
                    <img src={PayHubLogo} alt="" />
                </div>
                <div
                    className="support-container"
                    onClick={() => {
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
