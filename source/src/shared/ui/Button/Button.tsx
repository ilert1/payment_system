import { cva, VariantProps } from "class-variance-authority";
import styles from "./Button.module.scss";

const buttonVariants = cva(styles.button, {
    variants: {
        variant: {
            default: styles["btn--primary"],
            secondary: styles["btn--secondary"],
            outline: styles["btn--outline"],
            danger: styles["btn--danger"],
            dangerSolid: styles["btn--danger-solid"],
            ghost: styles["btn--ghost"]
        },
        size: {
            sm: styles["btn--small"],
            lg: styles["btn--large"],
            xl: styles["btn--xl"]
        },
        loading: {
            true: styles["button__loading"]
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

export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    disabled = false,
    loading = false,
    variant = "default",
    size = "sm",
    className,
    ...props
}) => (
    <button
        onClick={onClick}
        disabled={disabled || loading}
        className={buttonVariants({ variant, size, loading, className })}
        data-testid="custom-button"
        {...props}>
        {loading ? null : children}
    </button>
);
