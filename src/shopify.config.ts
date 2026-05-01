// ============================================================
// SHOPIFY CONFIG — fill these in once, use everywhere
// ============================================================
// 
// HOW TO GET THESE VALUES:
//
// SHOPIFY_DOMAIN:
//   Your Shopify admin URL looks like:
//   https://admin.shopify.com/store/YOUR-STORE-NAME
//   Your domain = "jindal-vastrakala-2.myshopify.com"
//
// STOREFRONT_ACCESS_TOKEN:
//   Shopify Admin → Settings → Apps and sales channels
//   → Develop apps → Create an app → API credentials
//   → Configure Storefront API scopes:
//     ✅ unauthenticated_read_product_listings
//     ✅ unauthenticated_read_product_inventory
//     ✅ unauthenticated_write_checkouts
//     ✅ unauthenticated_read_checkouts
//   → Install app → Copy "Storefront API access token"
//
// HOW TO GET PRODUCT IDs:
//   Shopify Admin → Products → click any product
//   Look at the URL: /products/1234567890123
//   That last number = your product ID
// ============================================================

export const SHOPIFY_CONFIG = {
  domain: "jindal-vastrakala-2.myshopify.com",         // ← replace
  storefrontToken: "082f44c0f1ac4b345ef99dc63db7553c",  // ← replace
};

// Add your product IDs here — get them from Shopify admin URLs
export const PRODUCT_IDS = {
  redBridalLehenga:     "0000000000001",  // ← replace with real IDs
  pastelSaree:          "0000000000002",
  greenLehenga:         "0000000000003",
  navratriChaniyaCholi: "0000000000004",
  budgetPartyLehenga:   "0000000000005",
};
