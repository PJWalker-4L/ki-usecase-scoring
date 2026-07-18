export default function ThemeScript() {
  const script = `(function(){try{var k="klarsicht-theme";var t=localStorage.getItem(k);if(t!=="dark"&&t!=="light"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}if(t==="dark"){document.documentElement.setAttribute("data-theme","dark");}else{document.documentElement.removeAttribute("data-theme");}document.documentElement.style.colorScheme=t;}catch(e){}})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
