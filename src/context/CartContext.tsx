import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductVariant, PackageOption, OrderDetails, NewMenuItem } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, variant: ProductVariant, packageOption: PackageOption, quantity?: number) => void;
  addNewMenuToCart: (menu: NewMenuItem) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQty: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  cartBounced: boolean;
  toastMessage: string | null;
  showToast: (message: string) => void;
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  // Payment & Delivery state
  selectedPaymentMethod: string;
  setSelectedPaymentMethod: (method: string) => void;
  // Routing state
  currentPath: string;
  navigate: (path: string) => void;
  // Order success state
  latestOrder: OrderDetails | null;
  setLatestOrder: (order: OrderDetails | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'kawan_lokal_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartBounced, setCartBounced] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [latestOrder, setLatestOrder] = useState<OrderDetails | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('QRIS / E-Wallet');

  // Simple client routing with popstate
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname + window.location.search;
      return path && path !== '' ? path : '/';
    }
    return '/';
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname + window.location.search);
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path !== currentPath) {
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', path);
      }
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const triggerCartBounce = () => {
    setCartBounced(true);
    setTimeout(() => setCartBounced(false), 600);
  };

  const addToCart = (
    product: Product,
    variant: ProductVariant,
    packageOption: PackageOption,
    quantity: number = 1
  ) => {
    const cartItemId = `${product.id}__${variant.id}__${packageOption.id}`;
    
    // Price calculation: (base price + variant modifier) * packageMultiplier * (1 - discountPercent)
    const baseItemPrice = (product.price + variant.priceModifier) * packageOption.multiplier;
    const discount = packageOption.discountPercent ? (baseItemPrice * packageOption.discountPercent) / 100 : 0;
    const finalItemPrice = Math.round(baseItemPrice - discount);

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            cartItemId,
            productId: product.id,
            productSlug: product.slug,
            productName: product.name,
            variantId: variant.id,
            variantName: variant.name,
            packageOptionId: packageOption.id,
            packageName: packageOption.name,
            packageMultiplier: packageOption.multiplier,
            unitPrice: product.price + variant.priceModifier,
            finalItemPrice,
            quantity,
            image: variant.image || product.image,
          },
        ];
      }
    });

    triggerCartBounce();
    showToast(`Added to your cart ✓`);
  };

  const addNewMenuToCart = (menu: NewMenuItem) => {
    const cartItemId = `ai-trending__${menu.nama_menu.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    const price = menu.estimasi_harga_rupiah || 25000;

    let imageUrl = '/basreng-pedas-hero.jpg';
    const catLower = (menu.kategori || '').toLowerCase();
    const nameLower = (menu.nama_menu || '').toLowerCase();
    if (catLower.includes('minuman') || nameLower.includes('tea') || nameLower.includes('boba') || nameLower.includes('matcha')) {
      imageUrl = '/tea-powder-canister.jpg';
    } else if (catLower.includes('seblak') || catLower.includes('cuanki') || nameLower.includes('kuah')) {
      imageUrl = '/seblak-bowl-hero.jpg';
    }

    setCart((prev) => {
      const idx = prev.findIndex((i) => i.cartItemId === cartItemId);
      if (idx > -1) {
        const next = [...prev];
        next[idx].quantity += 1;
        return next;
      }
      return [
        ...prev,
        {
          cartItemId,
          productId: cartItemId,
          productSlug: 'discover',
          productName: menu.nama_menu,
          variantId: 'ai-trending-special',
          variantName: menu.badge || '🔥 Trending',
          packageOptionId: 'single-special',
          packageName: '1 Porsi Rekomendasi AI',
          packageMultiplier: 1,
          unitPrice: price,
          finalItemPrice: price,
          quantity: 1,
          image: imageUrl,
        },
      ];
    });

    triggerCartBounce();
    showToast(`✓ "${menu.nama_menu}" berhasil dimasukkan ke keranjang!`);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
    } else {
      setCart((prev) =>
        prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item))
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.finalItemPrice * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        addNewMenuToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen((prev) => !prev),
        cartBounced,
        toastMessage,
        showToast,
        isSearchOpen,
        openSearch: () => setIsSearchOpen(true),
        closeSearch: () => setIsSearchOpen(false),
        currentPath,
        navigate,
        selectedPaymentMethod,
        setSelectedPaymentMethod,
        latestOrder,
        setLatestOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
