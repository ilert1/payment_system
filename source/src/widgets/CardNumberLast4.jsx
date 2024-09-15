import { useRef, useEffect } from "react";

export const CardNumberLast4 = ({ onComplete, showHidden }) => {
    const inputs = useRef();

    useEffect(() => {
        const items = inputs.current.children;
        for (let i = 0; i < items.length; i++) {
            items[i].addEventListener("input", () => {
                if (items[i].value != "") {
                    if (i >= items.length - 1) {
                        let numbers = [];
                        for (let j = 0; j < items.length; j++) {
                            numbers.push(items[j].value);
                        }
                        onComplete(numbers.join(""));
                    } else {
                        items[i + 1].focus();
                    }
                }
            });
        }

        items[0].focus();
    }, []);

    return (
        <div className="card-number-container">
            {showHidden ?
                <p>**** **** ****</p>
            :''}
            <div ref={inputs} className="inputs">
                <input type="text" className="card-input" maxLength="1" inputMode="numeric" />
                <input type="text" className="card-input" maxLength="1" inputMode="numeric" />
                <input type="text" className="card-input" maxLength="1" inputMode="numeric" />
                <input type="text" className="card-input" maxLength="1" inputMode="numeric" />
            </div>
        </div>
    );
};

export default CardNumberLast4;
