export type ProductCategory = 
  | 'Latiao Viral' 
  | 'Cuanki & Baso Aci' 
  | 'Cimol Bojot' 
  | 'Basreng Crispy' 
  | 'Seblak Viral' 
  | 'Cemilan Gurih'
  | 'Bubuk Minuman'
  | 'Bakery & Cookies'
  | 'Spicy' 
  | 'Viral Picks';

export interface ArticleSection {
  heading?: string;
  paragraphs: string[];
  highlightBox?: string;
  listItems?: string[];
  quote?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: 'Battle Review' | 'Tren Keranjang Kuning' | 'Resep & Tips' | 'Panduan Jajan' | 'Review Jujur' | 'Tren Kuliner Viral';
  readTime: string;
  date: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  heroImage: string;
  excerpt: string;
  sections: ArticleSection[];
  relatedProductIds: string[];
  tags: string[];
  featured?: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  priceModifier: number; // e.g. 0, 5000, etc.
  image: string;
  availability: boolean;
  colorTag?: string;
}

export interface PackageOption {
  id: string;
  name: string;
  multiplier: number; // e.g., 1, 2, 6
  discountPercent?: number; // e.g. 10% discount for box of 6
}

export interface TasteProfile {
  sweet: number;
  creamy: number;
  crunchy: number;
  rich: number;
  spicy: number;
}

export interface ProductReview {
  title: string;
  date: string;
  creatorVerdict: string;
  verdictTag: 'MUST TRY' | 'WORTH TRYING' | 'OVERHYPED' | 'SKIP THIS';
  whatILiked: string[];
  whatIDidntLike: string[];
  whoShouldTryIt: string;
  quote: string;
  reviewHeroExcerpt?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: ProductCategory;
  rating: number; // e.g. 9.1
  reviewCount: number;
  price: number; // base price in IDR
  location: string;
  viralStatus: boolean;
  viralBadgeText?: string;
  featuredInReviews?: boolean;
  image: string;
  galleryImages: string[];
  tasteProfile: TasteProfile;
  review: ProductReview;
  variants: ProductVariant[];
  packageOptions: PackageOption[];
  prepTime: string;
  shelfLife: string;
  storageInfo: string;
  productType?: 'food' | 'beverage_powder';
  powderWeight?: string;
  servingsPerPack?: string;
  brewingInstructions?: string[];
  bestServedWith?: string;
}

export interface CartItem {
  cartItemId: string; // unique combo of product.id + variant.id + packageOption.id
  productId: string;
  productSlug: string;
  productName: string;
  variantId: string;
  variantName: string;
  packageOptionId: string;
  packageName: string;
  packageMultiplier: number;
  unitPrice: number;
  finalItemPrice: number;
  quantity: number;
  image: string;
}

export interface OrderDetails {
  orderId: string;
  date: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  deliveryNotes?: string;
  deliveryMethod: 'Standard Delivery' | 'Same Day Delivery' | 'Pickup';
  deliveryFee: number;
  paymentMethod: string;
  paymentStatus?: 'LUNAS' | 'MENUNGGU_PEMBAYARAN' | 'COD_BELUM_BAYAR';
  virtualAccountNumber?: string;
  qrisNmid?: string;
  cardLastFour?: string;
  cardHolderName?: string;
  items: CartItem[];
  subtotal: number;
  total: number;
}

export interface UserAddress {
  id: string;
  userId: string;
  label: string;
  recipientName: string;
  phoneNumber: string;
  street: string;
  city: string;
  postalCode: string;
  notes?: string;
  isDefault?: boolean;
  createdAt: string;
}

export interface UserProfileData {
  userId: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  favoriteCategory?: string;
  photoURL?: string;
  createdAt?: string;
  updatedAt?: string;
}

