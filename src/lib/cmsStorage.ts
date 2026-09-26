export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  status: 'Active' | 'Draft';
}

export interface CMSContent {
  announcementText: string;
  promoPopupEnabled: boolean;
  promoDiscountCode: string;
  heroSlides: HeroSlide[];
  policies: {
    shipping: string;
    returns: string;
    privacy: string;
    care: string;
  };
}

const STORAGE_KEY = "enviaar_cms_content";

const defaultCMS: CMSContent = {
  announcementText: "COMPLIMENTARY SHIPPING | EASY SHOPPING | PREMIUM JEWELLERY",
  promoPopupEnabled: true,
  promoDiscountCode: "CIRCLE10",
  heroSlides: [
    {
      id: "slide_1",
      title: "Jewellery, Made to Stay With You.",
      subtitle: "Contemporary jewellery designed for everyday elegance and memorable occasions.",
      ctaText: "SHOP NEW ARRIVALS",
      ctaLink: "/new-arrivals",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&q=80",
      status: "Active",
    },
    {
      id: "slide_2",
      title: "The Royal Festive Collection 2026",
      subtitle: "Handcrafted 22K Gold Plated sets designed for celebration and heirloom heritage.",
      ctaText: "EXPLORE FESTIVE",
      ctaLink: "/festive",
      image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=1200&q=80",
      status: "Active",
    },
  ],
  policies: {
    shipping: "We provide complimentary insured express shipping across India. Standard delivery takes 3-5 business days.",
    returns: "Enjoy a hassle-free 7-day return and exchange policy on unworn jewellery in original packaging.",
    privacy: "We respect your personal privacy. All transactions are encrypted via 256-bit SSL technology.",
    care: "To maintain brilliance, store your jewellery in a dry zip pouch away from direct perfumes, hairsprays, and humidity.",
  },
};

export function getCMSContent(): CMSContent {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCMS));
      return defaultCMS;
    }
    const parsed = JSON.parse(raw);
    return { ...defaultCMS, ...parsed };
  } catch (err) {
    console.error("Error reading CMS content", err);
    return defaultCMS;
  }
}

export function saveCMSContent(content: Partial<CMSContent>): CMSContent {
  try {
    const current = getCMSContent();
    const updated = { ...current, ...content };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("cms-updated"));
    return updated;
  } catch (err) {
    console.error("Error saving CMS content", err);
    return getCMSContent();
  }
}
