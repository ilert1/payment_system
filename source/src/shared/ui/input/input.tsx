import { cva, VariantProps } from "class-variance-authority";
import styles from "./input.module.scss";
import { classNames } from "@/shared/lib/classNames";
import React from "react";

// const inputVariants = cva(styles.input, {
//     variants: {
//         variant: {
// default: "bg-transparent border border-gray-300",
// outline: "bg-transparent border border-gray-300"
//         }
//     }
// });

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    // , VariantProps<typeof inputVariants>
    bgWhite?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>((props: InputProps) => {
    const { className, bgWhite = true, ...restProps } = props;

    return (
        <input
            {...restProps}
            className={classNames(styles.input, { [styles.bgWhite]: bgWhite }, [className])}
            // className={classNames(inputVariants({ variant, className }), { [styles.bgWhite]: bgWhite })}
        />
    );
});
