"use client";
import { useTheme } from "next-themes";
import React from "react";

type Props = {};

export default function ThemeToggle({}: Props) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(() => (theme === "light" ? "dark" : "light"))}
    >
      {theme}
    </button>
  );
}
