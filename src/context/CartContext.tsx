import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductVariant, PackageOption, OrderDetails } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, variant: ProductVariant, packageOption: PackageOption, quantity?: number) => void;
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
