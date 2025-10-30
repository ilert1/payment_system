import { memo, ReactNode } from "react";
import { classNames } from "@/shared/lib/classNames";
import cls from "./Text.module.scss";

// primary - 37a8f3
// primary_light - 6fc0f6
export type TextVariant = "textBody" | "primary" | "primary_light" | "error" | "muted";

export type TextAlign = "right" | "left" | "center" | "justify";

// 14 17 20 21 22 23 31 46
export type TextSize = "xxs" | "2xs" | "xs" | "s" | "m" | "l" | "xl" | "xxl";

export type TextWeight = "regular" | "medium" | "semiBold";

interface TextProps {
    className?: string;
    text: string | ReactNode;
    variant?: TextVariant;
    align?: TextAlign;
    size?: TextSize;
    weight?: TextWeight;
    grow?: boolean;
    "data-testid"?: string;
    onClick?: () => void;
}

const mapSizeToClass: Record<TextSize, string> = {
    xxs: cls.size_xxs,
    "2xs": cls.size_2xs,
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
        variant = "textBody",
        align = "left",
        size = "xs",
        weight = "regular",
        grow,
        "data-testid": dataTestId = "Paragraph",
        onClick
    } = props;

    const sizeClass = mapSizeToClass[size];

    const additionalClasses = [className, cls[variant], cls[align], sizeClass, cls[weight]];

    return (
        <div className={classNames(cls.text, { [cls.grow]: grow }, additionalClasses)}>
            {text && (
                <p className={cls.text} data-testid={`${dataTestId}.Paragraph`} onClick={onClick}>
                    {text}
                </p>
            )}
        </div>
    );
});
