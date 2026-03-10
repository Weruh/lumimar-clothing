const registerAlpineComponents = () => {
  if (registerAlpineComponents._loaded || !window.Alpine) return;
  registerAlpineComponents._loaded = true;

  Alpine.data('lumimarShell', () => ({
    menuOpen: null,
    mobileNav: false,
    filterDrawer: false,
    miniCart: { open: false },
    wishlist: { open: false },
    cart: {
      count: 0,
      items: [],
      totals: { subtotal: 0, shipping: 0, grand_total: 0 },
    },

    init() {
      this.miniCart.open = false;
      this.wishlist.open = false;
      this.refreshCart();
      this.bindQuickAdd();
      this.$watch('miniCart.open', () => this.syncOverlayState());
      this.$watch('wishlist.open', () => this.syncOverlayState());
      this.$watch('mobileNav', () => this.syncOverlayState());
    },

    formatCurrency(value, currency = 'USD') {
      const number = Number(value || 0);
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
      }).format(number);
    },

    toggleMiniCart() {
      this.miniCart.open = !this.miniCart.open;
      // Close other overlays to avoid stacked glass panes.
      if (this.miniCart.open) {
        this.menuOpen = null;
        this.wishlist.open = false;
        this.refreshCart();
      }
    },

    toggleWishlist() {
      this.wishlist.open = !this.wishlist.open;
      if (this.wishlist.open) {
        this.menuOpen = null;
      }
    },

    toggleWishlistItem() {
      this.toggleWishlist();
    },

    refreshCart() {
      fetch('/cart/mini')
        .then((res) => res.json())
        .then((data) => {
          this.cart.items = data.items || [];
          this.cart.count = this.cart.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
          this.cart.totals = data.totals || { subtotal: 0, shipping: 0, grand_total: 0 };
        })
        .catch(() => {
          this.cart = { count: 0, items: [], totals: { subtotal: 0, shipping: 0, grand_total: 0 } };
        });
    },

    bindQuickAdd() {
      document.querySelectorAll('.js-quick-add').forEach((form) => {
        form.addEventListener('submit', (event) => {
          event.preventDefault();
          const formData = new FormData(form);
          fetch('/cart/add', {
            method: 'POST',
            headers: {
              'X-Requested-With': 'fetch',
              Accept: 'application/json',
            },
            body: formData,
          })
            .then((res) => res.json())
            .then(() => {
              this.refreshCart();
              this.menuOpen = null;
              this.wishlist.open = false;
            })
            .catch(() => {
              window.location.href = '/cart/';
            });
        });
      });
    },

    syncOverlayState() {
      const shouldLock = this.miniCart.open || this.wishlist.open || this.mobileNav;
      document.documentElement.classList.toggle('overflow-hidden', shouldLock);
      document.body.classList.toggle('overflow-hidden', shouldLock);
    },
  }));

  Alpine.data('productGallery', (mediaList = []) => ({
    mediaList,
    activeIndex: 0,
    autoplay: null,

    get activeMedia() {
      return this.mediaList[this.activeIndex] || this.mediaList[0] || {};
    },

    select(index) {
      this.activeIndex = index;
      if (this.autoplay) {
        clearInterval(this.autoplay);
        this.autoplay = null;
      }
    },
  }));

  Alpine.data('featuredSlider', (slides = []) => ({
    slides,
    current: 0,
    get currentSlide() {
      return this.slides[this.current] || {};
    },
    next() {
      if (!this.slides.length) return;
      this.current = (this.current + 1) % this.slides.length;
    },
    prev() {
      if (!this.slides.length) return;
      this.current = (this.current - 1 + this.slides.length) % this.slides.length;
    },
    goTo(i) {
      if (!this.slides.length) return;
      this.current = Math.max(0, Math.min(i, this.slides.length - 1));
    },
    priceLabel() {
      const p = this.currentSlide.price;
      return p ? `USD ${Number(p).toFixed(2)}` : 'USD —';
    },
  }));
};

if (window.Alpine) {
  registerAlpineComponents();
} else {
  document.addEventListener('alpine:init', registerAlpineComponents);
}
