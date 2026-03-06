'use client';

import { useEffect } from 'react';

const GA_ID = 'G-JYQN09HXKB';

export default function GoogleAnalytics() {
  useEffect(() => {
    // Inject gtag.js
    const script1 = document.createElement('script');
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    script1.async = true;
    document.head.appendChild(script1);

    // Init gtag
    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_ID}');
    `;
    document.head.appendChild(script2);
  }, []);

  return null;
}
