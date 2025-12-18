import { useEffect } from "react";

export function usePOSKeyboard({
  onSearch,
  onPay,
  onEscape,
}: {
  onSearch: () => void;
  onPay: () => void;
  onEscape: () => void;
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "F2") {
        e.preventDefault();
        onSearch();
      }
      if (e.key === "F3") {
        e.preventDefault();
        onPay();
      }
      if (e.key === "Escape") {
        onEscape();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
}
