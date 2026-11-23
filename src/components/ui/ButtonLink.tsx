import Link from "next/link";
import type { ComponentProps } from "react";
import { buttonStyles, type ButtonSize, type ButtonVariant } from "./Button";

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: ButtonVariant; size?: ButtonSize };

export default function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link {...props} className={buttonStyles(variant, size, className)} />;
}
