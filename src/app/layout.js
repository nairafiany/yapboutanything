import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/instrument-serif/400.css";
import "./globals.css";

export const metadata = {
  title: "yapboutanything",
  description: "Find something. Think a little. Yap about it.",
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
