import seedData from '@/data/seed.json';

function normalizeCurrency(currency?: string | null) {
  return String(currency || 'USD').trim().toUpperCase();
}

const USD_TO_KES_RATE = 130;

export function convertUsdToKes(value: number | string | null | undefined) {
  const amount = Number(value || 0);
  return Math.round((amount * USD_TO_KES_RATE + Number.EPSILON) * 100) / 100;
}

export type Category = {
  slug: string;
  name: string;
  label: string;
  parent_slug?: string | null;
  description?: string | null;
  menu_label?: string | null;
  menu_group?: string | null;
  persona?: string | null;
  is_active?: boolean;
  is_visible?: boolean;
  order?: number;
  children: Category[];
};

export type Product = {
  sku: string;
  slug: string;
  title: string;
  subtitle: string;
  category_slug: string;
  persona?: string;
  collections?: string[];
  price: number;
  compare_at_price?: number | null;
  currency?: string;
  stock?: number;
  badges?: string[];
  rating?: number;
  review_count?: number;
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  quick_sizes?: string[];
  materials?: string[];
  hero_image?: string | null;
  hover_image?: string | null;
  gallery?: { src: string; alt?: string; type?: string }[];
  video?: string | null;
  short_description?: string;
  description?: string;
  care?: string[];
  shipping_notes?: string[];
  origin?: string | null;
  ships_from?: string[];
  occasions?: string[];
  style_notes?: string[];
  complete_the_look?: string[];
  meta?: Record<string, unknown>;
};

export type MegaMenuColumn = {
  title: string;
  items: { slug: string; label: string }[];
};

export type MegaMenuSection = {
  root: Category;
  columns: MegaMenuColumn[];
  banner: {
    headline: string;
    copy: string;
    image?: string | null;
    link: string;
  };
};

export type HeroSlide = {
  headline: string;
  subheading: string;
  image?: string | null;
  link: string;
};

export type TrustSignal = {
  title: string;
  copy: string;
  icon: string;
};

export type CreatorSpotlight = {
  name: string;
  location: string;
  focus: string;
  image?: string | null;
};

export type Filters = {
  color?: string;
  size?: string;
  occasion?: string;
  ships_from?: string;
  badge?: string;
  collection?: string;
  price_min?: string | number;
  price_max?: string | number;
};

type SeedCategory = Omit<Category, 'children' | 'label'> & { children?: SeedCategory[] };

type SeedProduct = Product & { price: number };

type SeedData = {
  categories: SeedCategory[];
  products: SeedProduct[];
};

class CatalogStore {
  categoryTree: Category[] = [];
  categories = new Map<string, Category>();
  ancestorsMap = new Map<string, string[]>();
  descendantsMap = new Map<string, Set<string>>();

  products: Product[] = [];
  productsBySlug = new Map<string, Product>();
  productsByCategory = new Map<string, Product[]>();
  personaMap = new Map<string, Product[]>();
  collectionsMap = new Map<string, Product[]>();

  megaMenu: MegaMenuSection[] = [];
  heroSlides: HeroSlide[] = [];
  trustSignals: TrustSignal[] = [];
  creatorSpotlights: CreatorSpotlight[] = [];
  editorsPicks: Product[] = [];

  loadFromData(data: SeedData) {
    this.loadCategories(data.categories || []);
    this.computeHierarchyMaps();
    this.loadProducts(data.products || []);
    this.indexProducts();
    this.buildMegaMenu();
    this.buildBrandAssets();
  }

  loadCategories(categories: SeedCategory[]) {
    this.categoryTree = [];
    this.categories.clear();

    categories.forEach((payload, order) => {
      const category = this.createCategory(payload, null, order);
      this.categoryTree.push(category);
    });
  }

  createCategory(payload: SeedCategory, parent: Category | null, order: number): Category {
    const category: Category = {
      slug: payload.slug,
      name: payload.name,
      label: payload.menu_label || payload.name,
      parent_slug: parent ? parent.slug : null,
      description: payload.description ?? null,
      menu_label: payload.menu_label ?? null,
      menu_group: payload.menu_group ?? null,
      persona: payload.persona ?? null,
      is_active: payload.is_active ?? true,
      is_visible: payload.is_visible ?? true,
      order: payload.order ?? order,
      children: [],
    };

    this.categories.set(category.slug, category);

    (payload.children || []).forEach((childPayload, idx) => {
      const child = this.createCategory(childPayload, category, idx);
      category.children.push(child);
    });

    return category;
  }

  computeHierarchyMaps() {
    this.ancestorsMap.clear();
    this.descendantsMap.clear();

    this.categories.forEach((category, slug) => {
      const chain: string[] = [];
      let parentSlug = category.parent_slug || null;
      while (parentSlug) {
        chain.push(parentSlug);
        const parent = this.categories.get(parentSlug);
        parentSlug = parent?.parent_slug || null;
      }
      this.ancestorsMap.set(slug, chain);
    });

    const collect = (node: Category): Set<string> => {
      const bucket = new Set<string>();
      node.children.forEach((child) => {
        bucket.add(child.slug);
        collect(child).forEach((slug) => bucket.add(slug));
      });
      this.descendantsMap.set(node.slug, bucket);
      return bucket;
    };

    this.categoryTree.forEach((root) => collect(root));
  }

  loadProducts(products: SeedProduct[]) {
    this.products = [];
    this.productsBySlug.clear();
    this.personaMap.clear();
    this.collectionsMap.clear();

    products.forEach((item) => {
      const product: Product = {
        ...item,
        compare_at_price: item.compare_at_price ?? null,
        currency: item.currency || 'USD',
        badges: item.badges || [],
        rating: item.rating || 0,
        review_count: item.review_count || 0,
        colors: item.colors || [],
        sizes: item.sizes || [],
        quick_sizes: item.quick_sizes || [],
        materials: item.materials || [],
        subtitle: item.subtitle || '',
        hero_image: item.hero_image || null,
        hover_image: item.hover_image || null,
        gallery: item.gallery || [],
        video: item.video || null,
        short_description: item.short_description || '',
        description: item.description || '',
        care: item.care || [],
        shipping_notes: item.shipping_notes || [],
        origin: item.origin || null,
        ships_from: item.ships_from || [],
        occasions: item.occasions || [],
        style_notes: item.style_notes || [],
        complete_the_look: item.complete_the_look || [],
        meta: item.meta || {},
      };

      this.products.push(product);
      this.productsBySlug.set(product.slug, product);

      if (product.persona) {
        const list = this.personaMap.get(product.persona) || [];
        list.push(product);
        this.personaMap.set(product.persona, list);
      }

      (product.collections || []).forEach((collection) => {
        const list = this.collectionsMap.get(collection) || [];
        list.push(product);
        this.collectionsMap.set(collection, list);
      });
    });
  }

  indexProducts() {
    this.productsByCategory.clear();

    this.products.forEach((product) => {
      const categorySlugs = [product.category_slug, ...(this.ancestorsMap.get(product.category_slug) || [])];
      categorySlugs.forEach((slug) => {
        const list = this.productsByCategory.get(slug) || [];
        list.push(product);
        this.productsByCategory.set(slug, list);
      });
    });

    this.productsByCategory.forEach((items, slug) => {
      const sorted = [...items].sort((a, b) => {
        const ar = a.rating || 0;
        const br = b.rating || 0;
        if (ar !== br) return br - ar;
        const arev = a.review_count || 0;
        const brev = b.review_count || 0;
        if (arev !== brev) return brev - arev;
        return (a.price || 0) - (b.price || 0);
      });
      this.productsByCategory.set(slug, sorted);
    });

    this.products.sort((a, b) => String(a.sku).localeCompare(String(b.sku)));
    this.editorsPicks = [...this.products]
      .sort((a, b) => {
        const ar = a.rating || 0;
        const br = b.rating || 0;
        const arev = a.review_count || 0;
        const brev = b.review_count || 0;
        if (ar !== br) return br - ar;
        if (arev !== brev) return brev - arev;
        return (b.price || 0) - (a.price || 0);
      })
      .slice(0, 12);
  }

  buildMegaMenu() {
    const personaMessaging: Record<string, { headline: string; copy: string }> = {
      curvy: {
        headline: 'Wear your becoming',
        copy: 'Sculpted silhouettes and fabrics that honour your curves.',
      },
      petite: {
        headline: 'Curvy perfected, Petite refined',
        copy: 'Proportions tuned for presence without the weight.',
      },
      traditional: {
        headline: 'Modest looks, maximum elegance',
        copy: 'Globally-minded pieces crafted with cultural reverence.',
      },
      kids: {
        headline: 'Crafted for play, cut to last',
        copy: 'Joyful sizing from newborn to teen, ready for every season.',
      },
      footwear: {
        headline: 'Stride with intention',
        copy: 'Lumimar kicks and heels balanced for stamina and style.',
      },
      style: {
        headline: 'Complete the ritual',
        copy: 'Jewellery, lingerie, and carryalls that finish the story.',
      },
    };

    this.megaMenu = [];

    this.categoryTree.forEach((root) => {
      if (!root.is_visible || !root.is_active) return;

      const columns: MegaMenuColumn[] = root.children.map((child) => {
        const items = child.children.map((grand) => ({ slug: grand.slug, label: grand.label }));
        return { title: child.label, items };
      });

      const personaKey = root.persona || '';
      const heroProduct = (this.personaMap.get(personaKey) || []).find((p) => p.hero_image);
      const bannerCopy = personaMessaging[personaKey] || {
        headline: 'Crafted for the woman you are',
        copy: root.description || '',
      };

      this.megaMenu.push({
        root,
        columns,
        banner: {
          headline: bannerCopy.headline,
          copy: bannerCopy.copy,
          image: heroProduct?.hero_image || null,
          link: `/category/${root.slug}`,
        },
      });
    });
  }

  buildBrandAssets() {
    const slideRecipes: Array<[string, string, string]> = [
      ['Wear your becoming', '.Intentional pieces for heritage-rich wardrobes.', 'curvy'],
      ['Curvy perfected, Petite refined', 'Tailored proportions for women who own their presence.', 'petite'],
      ['Modest looks, maximum elegance', 'Global classics reinterpreted with African finesse.', 'traditional'],
    ];

    this.heroSlides = slideRecipes.map(([headline, subheading, persona]) => {
      const target = (this.personaMap.get(persona) || []).find((p) => p.hero_image);
      const categorySlug = this.personaRootSlug(persona);
      return {
        headline,
        subheading,
        image: target?.hero_image || null,
        link: categorySlug ? `/category/${categorySlug}` : '#',
      };
    });

    this.trustSignals = [
      {
        title: 'Free returns in 7 days',
        copy: 'Try your selections in your own space before you decide.',
        icon: 'arrow-uturn-left',
      },
      {
        title: 'Secure payments',
        copy: 'Encrypted checkout for cards, Mpesa, and trusted gateways.',
        icon: 'shield-check',
      },
      {
        title: 'Mpesa supported',
        copy: 'Pay in the rhythm you prefer with instant confirmations.',
        icon: 'device-phone-mobile',
      },
      {
        title: 'Africa and diaspora shipping',
        copy: 'Fulfilment lanes across EAC, UK, US, and EU with partners you know.',
        icon: 'globe-alt',
      },
    ];

    const getPersonaImage = (persona: string) =>
      (this.personaMap.get(persona) || []).find((p) => p.hero_image)?.hero_image || null;

    this.creatorSpotlights = [
      {
        name: 'Adesuwa Omoyeni',
        location: 'Lagos, Nigeria',
        focus: 'Ankara tailoring and quiet luxury suits',
        image: getPersonaImage('curvy'),
      },
      {
        name: 'Mei Nakamura',
        location: 'Kyoto and Nairobi',
        focus: 'Silk yukata with East African motifs',
        image: getPersonaImage('traditional'),
      },
      {
        name: 'Zuri Achieng',
        location: 'London, United Kingdom',
        focus: 'Petite suiting with Kenyan beadwork linings',
        image: getPersonaImage('petite'),
      },
    ];
  }

  getCategory(slug: string) {
    return this.categories.get(slug) || null;
  }

  personaRootSlug(persona: string) {
    for (const category of this.categoryTree) {
      if (category.persona === persona) return category.slug;
    }
    return null;
  }

  categoryPath(slug: string) {
    const trail: Category[] = [];
    let current = this.categories.get(slug);
    while (current) {
      trail.push(current);
      if (!current.parent_slug) break;
      current = this.categories.get(current.parent_slug) || undefined;
    }
    return trail.reverse();
  }

  descendants(slug: string) {
    return this.descendantsMap.get(slug) || new Set<string>();
  }

  productsForCategory(slug: string, filters: Filters = {}, sort: string = 'new') {
    const slugs = new Set<string>([slug, ...this.descendants(slug)]);
    const candidates = this.products.filter((product) => slugs.has(product.category_slug));
    const filtered = this.applyFilters(candidates, filters);
    return this.sortProducts(filtered, sort);
  }

  searchProducts(query: string, filters: Filters = {}, limit?: number) {
    const q = query.toLowerCase().trim();
    const candidates = this.products.filter((product) => {
      const collections = product.collections || [];
      return (
        product.title.toLowerCase().includes(q) ||
        product.subtitle.toLowerCase().includes(q) ||
        collections.some((collection) => collection.toLowerCase().includes(q)) ||
        product.description.toLowerCase().includes(q)
      );
    });
    const filtered = this.applyFilters(candidates, filters);
    return limit ? filtered.slice(0, limit) : filtered;
  }

  applyFilters(products: Product[], filters: Filters) {
    let items = [...products];

    if (filters.color) {
      const colorLower = filters.color.toLowerCase();
      items = items.filter((product) =>
        (product.colors || []).some((color) => color.name.toLowerCase().includes(colorLower))
      );
    }

    if (filters.size) {
      const sizeUpper = filters.size.toUpperCase();
      items = items.filter((product) =>
        (product.sizes || []).some((size) => size.toUpperCase() === sizeUpper)
      );
    }

    if (filters.occasion) {
      const occasionLower = filters.occasion.toLowerCase();
      items = items.filter((product) =>
        (product.occasions || []).some((occ) => occ.toLowerCase().includes(occasionLower))
      );
    }

    if (filters.ships_from) {
      const shipLower = filters.ships_from.toLowerCase();
      items = items.filter((product) =>
        (product.ships_from || []).some((loc) => loc.toLowerCase().includes(shipLower))
      );
    }

    if (filters.badge) {
      const badgeLower = filters.badge.toLowerCase();
      items = items.filter((product) =>
        (product.badges || []).some((badge) => badge.toLowerCase().includes(badgeLower))
      );
    }

    if (filters.collection) {
      const collectionLower = filters.collection.toLowerCase();
      items = items.filter((product) =>
        (product.collections || []).some((collection) => collection.toLowerCase().includes(collectionLower))
      );
    }

    if (filters.price_min !== undefined && filters.price_min !== '') {
      const min = Number(filters.price_min);
      if (!Number.isNaN(min)) {
        items = items.filter((product) => (product.price || 0) >= min);
      }
    }

    if (filters.price_max !== undefined && filters.price_max !== '') {
      const max = Number(filters.price_max);
      if (!Number.isNaN(max)) {
        items = items.filter((product) => (product.price || 0) <= max);
      }
    }

    return items;
  }

  sortProducts(products: Product[], sort: string) {
    const sortKey = sort.toLowerCase();
    if (sortKey === 'price_low' || sortKey === 'price') {
      return [...products].sort((a, b) => (a.price || 0) - (b.price || 0));
    }
    if (sortKey === 'price_high') {
      return [...products].sort((a, b) => (b.price || 0) - (a.price || 0));
    }
    if (sortKey === 'rating' || sortKey === 'best') {
      return [...products].sort((a, b) => {
        const ar = a.rating || 0;
        const br = b.rating || 0;
        if (ar !== br) return br - ar;
        const arev = a.review_count || 0;
        const brev = b.review_count || 0;
        if (arev !== brev) return brev - arev;
        return (b.price || 0) - (a.price || 0);
      });
    }
    if (sortKey === 'new') {
      return [...products].sort((a, b) => String(b.sku).localeCompare(String(a.sku)));
    }
    return [...products];
  }

  getProductsBySlugs(slugs: string[]) {
    return slugs
      .map((slug) => this.productsBySlug.get(slug))
      .filter((product): product is Product => Boolean(product));
  }

  newIn(limit: number = 12) {
    return [...this.products].sort((a, b) => String(b.sku).localeCompare(String(a.sku))).slice(0, limit);
  }

  bestSellers(limit: number = 12) {
    return [...this.products]
      .sort((a, b) => {
        const arev = a.review_count || 0;
        const brev = b.review_count || 0;
        if (arev !== brev) return brev - arev;
        const ar = a.rating || 0;
        const br = b.rating || 0;
        if (ar !== br) return br - ar;
        return (b.price || 0) - (a.price || 0);
      })
      .slice(0, limit);
  }

  lifestyleTiles() {
    const personas = [
      ['Curvy Babes', 'women-curvy-babes', 'Sculpted silhouettes with ease.'],
      ['Petite Babes', 'women-petite-babes', 'Proportions tuned for smaller frames.'],
      ['Traditional and Global', 'traditional-global', 'Heritage forms, modern finish.'],
      ['Kids', 'kids', 'Joyful fits sized for play.'],
      ['Shoes', 'shoes', 'From Lumimar kicks to considered heels.'],
      ['Intimates and Style', 'intimates-style', 'Layering pieces that complete the ritual.'],
    ];

    return personas.map(([title, slug, copy]) => {
      const hero = (this.productsByCategory.get(slug) || [])[0];
      return {
        title,
        slug,
        copy,
        image: hero?.hero_image || null,
      };
    });
  }

  facetsFor(products: Product[]) {
    const colors = new Set<string>();
    const sizes = new Set<string>();
    const occasions = new Set<string>();
    const shipsFrom = new Set<string>();

    products.forEach((product) => {
      (product.colors || []).forEach((color) => colors.add(color.name));
      (product.sizes || []).forEach((size) => sizes.add(size));
      (product.occasions || []).forEach((occ) => occasions.add(occ));
      (product.ships_from || []).forEach((location) => shipsFrom.add(location));
    });

    return {
      colors: [...colors].sort(),
      sizes: [...sizes].sort(),
      occasions: [...occasions].sort(),
      ships_from: [...shipsFrom].sort(),
    };
  }
}

let catalogInstance: CatalogStore | null = null;

export function getCatalog() {
  if (!catalogInstance) {
    const store = new CatalogStore();
    store.loadFromData(seedData as SeedData);
    catalogInstance = store;
  }
  return catalogInstance;
}

export function formatCurrency(value: number | string | null | undefined, currency: string = 'USD') {
  const number = Number(value || 0);
  const normalizedCurrency = normalizeCurrency(currency);
  const locale = normalizedCurrency === 'KES' ? 'en-KE' : 'en-US';
  return new Intl.NumberFormat(locale, { style: 'currency', currency: normalizedCurrency }).format(number);
}

export function savingsPercent(product: Product) {
  if (product.compare_at_price && product.compare_at_price > 0) {
    return Math.round((1 - product.price / product.compare_at_price) * 100);
  }
  return 0;
}

export function ensureImage(src?: string | null) {
  return src || '/static/img/blank.png';
}

export function paginate<T>(items: T[], page: number, perPage: number) {
  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(page, 1), pages);
  const start = (safePage - 1) * perPage;
  const end = start + perPage;
  return {
    items: items.slice(start, end),
    pagination: {
      page: safePage,
      pages,
      total,
      has_prev: safePage > 1,
      has_next: safePage < pages,
      prev_page: safePage > 1 ? safePage - 1 : null,
      next_page: safePage < pages ? safePage + 1 : null,
    },
  };
}

export function extractFilters(searchParams: Record<string, string | string[] | undefined>): Filters {
  const pick = (key: keyof Filters) => {
    const value = searchParams[key];
    if (Array.isArray(value)) return value[0];
    return value;
  };

  return {
    color: pick('color'),
    size: pick('size'),
    occasion: pick('occasion'),
    ships_from: pick('ships_from'),
    badge: pick('badge'),
    collection: pick('collection'),
    price_min: pick('price_min'),
    price_max: pick('price_max'),
  };
}
