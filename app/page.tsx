"use client";
import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { usePathname } from "next/navigation";

export default function Home() {
  const pathName = usePathname();

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title()}>Face-auth&nbsp;</h1>
        <h1 className={title({ color: "yellow" })}>recognition&nbsp;</h1>
        <br />
        <h1 className={title()}>Using face-api.js</h1>
      </div>

      <div className="flex gap-3">
        <Link
          className={buttonStyles({
            color: "warning",
            radius: "full",
            variant: "shadow",
          })}
          href={siteConfig.links.login}
        >
          Login
        </Link>
        <Link
          className={buttonStyles({ variant: "bordered", radius: "full" })}
          href={siteConfig.links.signup}
        >
          Register
        </Link>
      </div>
    </section>
  );
}
