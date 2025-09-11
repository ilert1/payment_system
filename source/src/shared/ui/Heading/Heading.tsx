import { memo, ReactNode } from "react";
import { classNames } from "@/shared/lib/classNames";
import cls from "./Heading.module.scss";

export type TextVariant = "primary" | "error" | "accent";

export type TextAlign = "right" | "left" | "center";

export type TextSize = "m" | "l";

interface TextProps {
    className?: string;
    title: string | ReactNode;
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

export const Heading = memo((props: TextProps) => {
    const {
        className,
        title,
        variant = "primary",
        align = "left",
        size = "m",
        bold,
        grow,
        "data-testid": dataTestId = "Header"
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
        </div>
    );
});
