import { memo, ReactNode } from "react";
import { classNames } from "@/shared/lib/classNames";
import cls from "./Text.module.scss";

export type TextVariant = "primary" | "error" | "accent";

export type TextAlign = "right" | "left" | "center";

export type TextSize = "m" | "l";

interface TextProps {
    className?: string;
    title?: string | ReactNode;
    text?: string;
    variant?: TextVariant;
    align?: TextAlign;
    size?: TextSize;
    bold?: boolean;
    grow?: boolean;
    "data-testid"?: string;
}

type HeaderTagType = "h1" | "h2";

const mapSizeToClass: Record<TextSize, string> = {
    m: cls.size_m,
    l: cls.size_l
};

const mapSizeToHeaderTag: Record<TextSize, HeaderTagType> = {
    m: "h2",
    l: "h1"
};

export const Text = memo((props: TextProps) => {
    const {
        className,
        text,
        title,
        variant = "primary",
        align = "left",
        size = "m",
        bold,
        grow,
        "data-testid": dataTestId = "Text"
    } = props;

    const HeaderTag = mapSizeToHeaderTag[size];
    const sizeClass = mapSizeToClass[size];

    const additionalClasses = [className, cls[variant], cls[align], sizeClass];

    return (
        <div className={classNames(cls.Text, { [cls.bold]: bold, [cls.grow]: grow }, additionalClasses)}>
            {title && (
                <HeaderTag className={cls.title} data-testid={`${dataTestId}.Header`}>
                    {title}
                </HeaderTag>
            )}
            {text && (
                <p className={cls.text} data-testid={`${dataTestId}.Paragraph`}>
                    {text}
                </p>
            )}
        </div>
    );
});

// h3
// PayeeDataItem.module Piti darna h2
// .h3 {
//     font-size: 25px;
//     font-weight: 600;
//     line-height: 35px;

//     @media (width <= 520px) {
//         font-size: 18px;
//         line-height: 24px;
//     }
// }

// h2
// PayeeDataItem.module
// .h2 {
//     margin-bottom: 12px;

//     font-size: 25px;
//     font-weight: 600;
//     line-height: 133%; // 33.38px;
//     text-align: left;

//     @media (width <= 520px) {
//         margin-bottom: 8px;
//         font-size: 18px;
//     }
// }

// SubmitModal.module Piti darna h1
// .h3 {
//     font-size: 32px;
//     font-weight: 600;
//     line-height: 43px;

//     @media (width <= 520px) {
//         font-size: 24px;
//         line-height: 32px;
//     }
// }

// PayHeader.module
// .h1 {
//     font-size: 32px;
//     line-height: 43px;
//     text-align: left;
//     text-wrap: balance;

//     @media (width <= 520px) {
//         font-size: 22px;
//         line-height: 29px;
//     }
// }

// Styles.scss
// h1 {
//     margin: 0;

//     font-size: 32px;
//     font-weight: 600;
//     line-height: 133%;
//     color: #010f18;
//     text-wrap: balance;

//     &.grow {
//         flex-grow: 0.3;
//     }

//     @media (width <= 520px) {
//         font-size: 22px;
//         line-height: 32px;
//     }
// }
