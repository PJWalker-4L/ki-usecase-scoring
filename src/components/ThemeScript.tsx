"use client";

import { useServerInsertedHTML } from "next/navigation";
import { THEME_STORAGE_KEY } from "@/lib/theme";

/**
 * Injects a blocking theme boot script via the SSR HTML stream.
 * Returns null in the React tree so React 19 never sees a <script> child
 * during client render (which would error).
 */
export default function ThemeScript() {
  useServerInsertedHTML(() => (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var t=localStorage.getItem(k);if(t!=="dark"&&t!=="light"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}if(t==="dark"){document.documentElement.setAttribute("data-theme","dark");}else{document.documentElement.removeAttribute("data-theme");}document.documentElement.style.colorScheme=t;}catch(e){}})();`,
      }}
    />
  ));

  return null;
}
