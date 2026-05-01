import { useEffect, useRef, useState } from "react";

interface ShopifyBuyButtonProps {
  productId: string;        // Shopify product ID (numbers only)
  storefrontToken: string;  // Your Shopify Storefront Access Token
  shopDomain: string;       // e.g. "jindal-vastrakala.myshopify.com"
  buttonText?: string;
  className?: string;
}

export function ShopifyBuyButton({
  productId,
  storefrontToken,
  shopDomain,
  buttonText = "Buy Now — Pay with UPI / Card / COD",
  className = "",
}: ShopifyBuyButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const scriptId = "shopify-buy-btn-script";

    const initButton = () => {
      if (!window.ShopifyBuy || !containerRef.current) return;

      // Clear previous render
      if (containerRef.current) containerRef.current.innerHTML = "";

      const client = window.ShopifyBuy.buildClient({
        domain: shopDomain,
        storefrontAccessToken: storefrontToken,
      });

      window.ShopifyBuy.UI.onReady(client).then((ui: any) => {
        ui.createComponent("product", {
          id: productId,
          node: containerRef.current,
          moneyFormat: "%E2%82%B9{{amount}}",
          options: {
            product: {
              styles: {
                product: {
                  "@media (min-width: 601px)": { "max-width": "100%", "margin-left": "0", "margin-bottom": "0" },
                },
                button: {
                  "font-family": "inherit",
                  "font-size": "14px",
                  "padding-top": "14px",
                  "padding-bottom": "14px",
                  "padding-left": "24px",
                  "padding-right": "24px",
                  "background-color": "#1a1a1a",
                  "border-radius": "4px",
                  ":hover": { "background-color": "#333" },
                  ":focus": { "background-color": "#333" },
                  width: "100%",
                },
              },
              text: { button: buttonText },
              layout: "vertical",
              contents: { img: false, title: false, price: false },
            },
            cart: {
              styles: {
                button: {
                  "font-family": "inherit",
                  "background-color": "#1a1a1a",
                  ":hover": { "background-color": "#333" },
                },
              },
              text: { total: "Subtotal", button: "Checkout — Pay with UPI / Card / COD" },
              popup: false,
            },
          },
        });
        setLoaded(true);
      }).catch(() => setError(true));
    };

    if (document.getElementById(scriptId)) {
      initButton();
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.async = true;
    script.src = "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";
    script.onload = initButton;
    script.onerror = () => setError(true);
    document.head.appendChild(script);
  }, [productId, storefrontToken, shopDomain, buttonText]);

  if (error) {
    return (
      <a
        href={`https://wa.me/918368319092?text=Hi, I want to order this product`}
        target="_blank"
        rel="noopener noreferrer"
        className={`block w-full text-center py-3 px-6 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors ${className}`}
      >
        Order on WhatsApp
      </a>
    );
  }

  return (
    <div className={className}>
      {!loaded && (
        <div className="w-full py-3 px-6 bg-gray-900 text-white text-center text-sm rounded animate-pulse">
          Loading payment options...
        </div>
      )}
      <div ref={containerRef} />
    </div>
  );
}

// Extend window type for Shopify SDK
declare global {
  interface Window {
    ShopifyBuy: any;
  }
}
