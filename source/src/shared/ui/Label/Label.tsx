import { cva, VariantProps } from "class-variance-authority";
import { ReactNode } from "react";
import styles from "./Label.module.scss";

const labelVariant = cva(styles.label, {
    variants: {
        variant: {
            default: styles.default
        },
        size: {
            sm: styles.sm, // 14px
            md: styles.md // 20px
        },
        weight: {
            regular: styles.regular, // 400
            medium: styles.medium // 500
        },
        align: {
            left: styles.left,
            center: styles.center,
            right: styles.right
        }
    },
    defaultVariants: {
        variant: "default",
        size: "md",
        weight: "regular",
        align: "left"
    }
});

interface LabelProps extends React.ButtonHTMLAttributes<HTMLLabelElement>, VariantProps<typeof labelVariant> {
    asChild?: boolean;
    variant?: VariantProps<typeof labelVariant>["variant"];
    className?: string;
    text: string | ReactNode;
}

export const Label = ({ variant, size, weight, align, className, text, ...props }: LabelProps) => {
    return (
        <label {...props} className={labelVariant({ variant, size, weight, className })}>
            {text}
        </label>
    );
};
