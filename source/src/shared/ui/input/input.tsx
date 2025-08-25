import { cva, VariantProps } from "class-variance-authority";
import React from "react";
import { classNames } from "@/shared/lib/classNames";
import styles from "./input.module.scss";

const inputVariants = cva(styles.input, {
    variants: {
        textSize: {
            sm: styles.textSm,
            md: styles.textMd,
            lg: styles.textLg
        }
    }
});

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {
    bgWhite?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>((props: InputProps) => {
    const { className = "", bgWhite = true, textSize = "md", ...restProps } = props;

    return (
        <input
            {...restProps}
            className={classNames(inputVariants({ textSize }), { [styles.bgwhite]: bgWhite }, [className])}
        />
    );
});
