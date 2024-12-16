"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export const GoogleAnalytics = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const GA_MEASUREMENT_ID = "G-D9HLCLELSF";

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(...args) {
      window.dataLayer.push(args);
    }
    gtag("js", new Date());
    gtag("config", GA_MEASUREMENT_ID);

    function handleRouteChange() {
      gtag("event", "page_view", {
        page_path: pathname + searchParams.toString(),
      });
    }

    handleRouteChange();

    return () => {
      document.head.removeChild(script);
    };
  }, [pathname, searchParams]);

  return null;
};
