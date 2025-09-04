import { cva, VariantProps } from "class-variance-authority";
import React from "react";
import styles from "./Button.module.scss";

const buttonVariants = cva(styles.button, {
    variants: {
        variant: {
            default: styles.btnPrimary,
            secondary: styles.btnSecondary,
            outline: styles.btnOutline,
            danger: styles.btnDanger,
            dangerSolid: styles.btnDangerSolid,
            ghost: styles.btnGhost,
            ghostDanger: styles.btnGhostDanger
        },
        size: {
            sm: styles.btnSmall,
            lg: styles.btnLarge,
            xl: styles.btnXl
        },
        loading: {
            true: styles.button__loading
        }
    },
    defaultVariants: {
        variant: "default",
        size: "sm"
    }
});

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    variant?: VariantProps<typeof buttonVariants>["variant"];
    className?: string;
    loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        { children, onClick, disabled = false, loading = false, variant = "default", size = "sm", className, ...props },
        ref
    ) => {
        return (
            <button
                ref={ref}
                onClick={onClick}
                disabled={disabled || loading}
                className={buttonVariants({ variant, size, loading, className })}
                data-testid="custom-button"
                {...props}>
                {loading ? null : children}
            </button>
        );
    }
);
Button.displayName = "Button";
