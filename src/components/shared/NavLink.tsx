import Link from "next/link";
import { cn } from "@/lib/utils";

export default function NavLink({
  href,
  active,
  children,
  className,
  onClick,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={cn(
        "text-sm font-medium underline-offset-4 transition-colors hover:text-primary hover:underline",
        active ? "text-primary" : "text-muted-foreground",
        className
      )}
    >
      {children}
    </Link>
  );
}
