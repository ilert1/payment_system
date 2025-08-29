import { cva, VariantProps } from "class-variance-authority";
import React from "react";
import styles from "./input.module.scss";

const inputVariants = cva(styles.input, {
    variants: {
        textSize: {
            sm: styles.textSm,
            md: styles.textMd,
            lg: styles.textLg
        },
        bgWhite: {
            true: styles.bgwhite
        }
    }
});

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {
    bgWhite?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>((props: InputProps, ref) => {
    const { className = "", bgWhite = true, textSize = "md", ...restProps } = props;

    return <input {...restProps} ref={ref} className={inputVariants({ textSize, bgWhite, className })} />;
});
