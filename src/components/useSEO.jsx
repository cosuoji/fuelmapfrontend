import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Custom hook for managing SEO meta tags dynamically
 * @param {Object} options - SEO options
 * @param {string} options.title - Page title
 * @param {string} [options.description] - Meta description
 * @param {string} [options.keywords] - Meta keywords
 * @param {string} [options.image] - Image URL for social previews
 */
export function useSEO({ title, description, keywords, image }) {
  const location = useLocation();

  useEffect(() => {
    const baseUrl = "https://fuelpricedirectory.netlify.app"; // ✅ your deployed domain
    const currentUrl = `${baseUrl}${location.pathname}`;

    // ✅ Update <title>
    if (title) {
      document.title = `${title} | Fuel Price Directory`;
    }

    // ✅ Utility to create or update meta tags
    const setMetaTag = (attr, value, property = "name") => {
      if (!value) return;
      let element = document.querySelector(`meta[${property}="${attr}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(property, attr);
        document.head.appendChild(element);
      }
      element.setAttribute("content", value);
    };

    // ✅ Standard meta tags
    if (description) setMetaTag("description", description);
    if (keywords) setMetaTag("keywords", keywords);

    // ✅ Canonical link
    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", currentUrl);

    // ✅ Social (Open Graph) tags
    setMetaTag("og:title", title, "property");
    setMetaTag("og:description", description, "property");
    setMetaTag("og:url", currentUrl, "property");
    setMetaTag("og:type", "website", "property");
    if (image) setMetaTag("og:image", image, "property");

    // ✅ Twitter Cards
    setMetaTag("twitter:card", "summary_large_image");
    setMetaTag("twitter:title", title);
    setMetaTag("twitter:description", description);
    if (image) setMetaTag("twitter:image", image);

  }, [title, description, keywords, image, location.pathname]);
}
