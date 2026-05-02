import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

type SharedProps = {
  children: ReactNode;
  variant?: "solid" | "outline";
  className?: string;
};

type ButtonProps = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type LinkButtonProps = SharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
  };

type Props = ButtonProps | LinkButtonProps;

const baseClass =
  "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition active:scale-[0.98]";

const variants = {
  solid: "bg-brand-600 text-white hover:bg-brand-700",
  outline: "border border-brand-600 text-brand-700 hover:bg-brand-100"
};

function composeClass(variant: "solid" | "outline", className?: string) {
  return `${baseClass} ${variants[variant]} ${className ?? ""}`.trim();
}

export function Button(props: Props) {
  const variant = props.variant ?? "solid";

  if ("href" in props && typeof props.href === "string") {
    const { children, className, href, ...rest } = props;
    return (
      <Link href={href} className={composeClass(variant, className)} {...rest}>
        {children}
      </Link>
    );
  }

  const { children, className, type = "button", ...rest } = props;
  return (
    <button type={type} className={composeClass(variant, className)} {...rest}>
      {children}
    </button>
  );
}
