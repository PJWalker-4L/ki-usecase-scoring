import Image from "next/image";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: "h-36 w-36",
  md: "h-48 w-48",
  lg: "h-60 w-60",
  inline: "h-32 w-32 sm:h-52 sm:w-52 md:h-60 md:w-60 lg:h-72 lg:w-72",
  hero: "h-64 w-64 sm:h-80 sm:w-80 md:h-96 md:w-96",
} as const;

export default function RobotMascot({
  size = "md",
  src = "/robot.png",
  className,
}: {
  size?: keyof typeof SIZES;
  src?: string;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt=""
      width={384}
      height={384}
      aria-hidden
      // Preserve PNG alpha — the default optimizer composites onto white.
      unoptimized
      className={cn("pointer-events-none w-auto max-w-none select-none object-contain", SIZES[size], className)}
    />
  );
}
