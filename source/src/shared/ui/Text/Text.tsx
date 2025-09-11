import { memo, ReactNode } from "react";
import { classNames } from "@/shared/lib/classNames";
import cls from "./Text.module.scss";

export type TextVariant = "primary" | "error" | "accent";

export type TextAlign = "right" | "left" | "center";

// 17 20 21 22 23 31 46
export type TextSize = "xxs" | "xs" | "s" | "m" | "l" | "xl" | "xxl";

interface TextProps {
    className?: string;
    text: string | ReactNode;
    variant?: TextVariant;
    align?: TextAlign;
    size?: TextSize;
    bold?: boolean;
    grow?: boolean;
    "data-testid"?: string;
}

const mapSizeToClass: Record<TextSize, string> = {
    xxs: cls.size_xxs,
    xs: cls.size_xs,
    s: cls.size_s,
    m: cls.size_m,
    l: cls.size_l,
    xl: cls.size_xl,
    xxl: cls.size_xxl
};

export const Text = memo((props: TextProps) => {
    const {
        className,
        text,
        variant = "primary",
        align = "left",
        size = "m",
        bold,
        grow,
        "data-testid": dataTestId = "Paragraph"
    } = props;

    const sizeClass = mapSizeToClass[size];

    const additionalClasses = [className, cls[variant], cls[align], sizeClass];

    return (
        <div className={classNames(cls.Text, { [cls.bold]: bold, [cls.grow]: grow }, additionalClasses)}>
            {text && (
                <p className={cls.text} data-testid={`${dataTestId}.Paragraph`}>
                    {text}
                </p>
            )}
        </div>
    );
});

// .dropZoneText {
//     color: #6fc0f6;
// }

// .amount {
//     min-width: 1ch;
//     border: none;

//     font-family: inherit;
//     font-size: 46px;
//     font-weight: 600;
//     line-height: 130%;
//     color: #37a8f3;
//     text-align: right;
//     white-space: nowrap;

//     background: none;
//     outline: none;

//     @media (width <= 520px) {
//         font-size: 32px;
//     }
// }

// .p {
//     cursor: pointer;

//     font-size: 14px !important;
//     font-weight: 400;
//     line-height: 18.69px;
//     color: #010f18;

//     transition: color 0.3s ease-in-out;
// }

// .statusComment {
//     font-size: 20px;
//     font-weight: 400;
//     line-height: 133%;
//     color: #010f18;

//     opacity: 0.5;

//     @media (width <= 520px) {
//         font-size: 14px;
//     }
// }

// .statusComment {
//     margin-top: 21px;

//     font-size: 20px !important;
//     font-weight: 400 !important;
//     line-height: 133% !important;
//     color: #010f18 !important;

//     opacity: 0.5;

//     @media (width <= 520px) {
//         margin-top: 15px;
//         font-size: 14px;
//     }
// }

// .errorMessage {
//     width: 100%;

//     font-size: 12px !important;
//     color: rgb(177 14 14) !important;
//     text-align: left;
//     overflow-wrap: break-word;
// }

// .p {
//     font-size: 31px;
//     font-weight: 600;
//     line-height: 133%;
//     color: #010f18;
//     white-space: nowrap;

//     opacity: 0.5;

//     @media (width <= 650px) {
//         font-size: clamp(18px, 3.5vw, 31px);
//     }

//     @media (width <= 520px) {
//         font-size: 22px;
//     }
// }

// .statusText {
//     font-weight: 400;
// }

// .statusComment {
//     font-size: 20px;
//     font-weight: 400;
//     line-height: 133%;
//     color: #010f18;

//     opacity: 0.5;

//     @media (width <= 520px) {
//         font-size: 14px;
//     }
// }

// .text {
//     /* font-size: 30px;
//     line-height: 40px; */
//     font-size: 20px;
//     font-weight: 400;
//     line-height: 30px;
//     text-align: justify;

//     @media (width <= 520px) {
//         /* font-size: 16px;
//         line-height: 21px; */
//         font-size: 16px;
//         line-height: 22px;
//         text-align: justify;
//     }
// }

// .errorMessage {
//     width: 100%;

//     font-size: 12px !important;
//     color: rgb(177 14 14) !important;
//     text-align: left;
//     overflow-wrap: break-word;
// }
