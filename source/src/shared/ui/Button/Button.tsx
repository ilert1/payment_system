import { cva, VariantProps } from "class-variance-authority";

const buttonVariants = cva("button", {
    variants: {
        variant: {
            default: "btn--primary",
            secondary: "btn--secondary",
            outline: "btn--outline",
            danger: "btn--danger",
            dangerSolid: "btn--danger-solid",
            ghost: "btn--ghost"
        },
        size: {
            sm: "btn--small",
            lg: "btn--large",
            xl: "btn--xl"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "sm"
    }
});

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, disabled = false, variant = "primary" }) => (
    <button onClick={onClick} disabled={disabled} className={`btn btn-${variant}`} data-testid="custom-button">
        {children}
    </button>
);
