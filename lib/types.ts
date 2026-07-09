// API Response wrapper
export interface ApiResponse<T> {
  message: string;
  status: "success" | "error";
  data: T;
}

// Error response
export interface ApiError {
  statusCode: number;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Publication
export interface Publication {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  status: "PUBLISHED" | "DRAFT";
  createdAt: string;
  updatedAt: string;
}

// Subject
export interface Subject {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Category
export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

// Book Attachment
export interface BookAttachment {
  id: string;
  url: string;
  type: "THUMBNAIL" | "IMAGE" | "PDF";
  sortOrder: number;
}

// Book Part
export interface BookPart {
  id: string;
  bookId: string;
  title: string;
  partNumber: number;
  description: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

// Review
export interface Review {
  id: string;
  bookId: string;
  reviewerName: string;
  designation: string;
  rating: number;
  comment: string;
  displayOrder: number;
  status: "PUBLISHED" | "DRAFT";
  createdAt: string;
  updatedAt: string;
}

// Price Range (for book listing)
export interface PriceRange {
  min: number;
  max: number;
  display: string;
}

// Book Paper (variant)
export interface BookPaper {
  id: string;
  bookId: string;
  code: string;
  name: string;
  price: string | number;
  discountPrice: string | number | null;
  discountStartDate: string | null;
  discountEndDate: string | null;
  stock: number;
  isbn: string | null;
  pageCount: number | null;
  thumbnail: string | null;
  sortOrder: number;
  isDefault: boolean;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  effectivePrice?: number;
  isInStock: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

// Book
export interface Book {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  isbn: string;
  publicationDate: string;
  edition: string;
  language: string;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  thumbnail: string;
  publicationId: string;
  subjectId: string;
  createdAt: string;
  updatedAt: string;
  publication: Publication;
  subject: Subject;
  parts: BookPart[];
  attachments: BookAttachment[];
  reviews: Review[];
  papers: BookPaper[];
  priceRange: PriceRange | null;
}

// Banner
export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
  buttonUrl: string;
  displayOrder: number;
  status: "PUBLISHED" | "DRAFT";
  createdAt: string;
  updatedAt: string;
}

// Teacher Book (nested in teacher response)
export interface TeacherBook {
  teacherId: string;
  bookId: string;
  book: {
    id: string;
    title: string;
    slug: string;
    thumbnail: string;
    price: number;
  };
}

// Teacher
export interface Teacher {
  id: string;
  name: string;
  designation: string;
  bio: string;
  photo: string;
  facebook: string;
  linkedin: string;
  website: string;
  displayOrder: number;
  featured: boolean;
  status: "PUBLISHED" | "DRAFT";
  createdAt: string;
  updatedAt: string;
  teacherBooks: TeacherBook[];
}

// Cart Item
export interface CartItem {
  id: string;
  cartId: string;
  bookId: string;
  paperId: string | null;
  quantity: number;
  book: {
    id: string;
    title: string;
    thumbnail: string;
  };
  paper: BookPaper | null;
}

// Cart
export interface Cart {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  cartItems: CartItem[];
}

// Wishlist Item
export interface WishlistItem {
  id: string;
  userId: string;
  bookId: string;
  createdAt: string;
  book: Book;
}

// Address
export interface Address {
  id: string;
  userId: string;
  name: string;
  phone: string;
  country: string | null;
  division: string | null;
  district: string;
  area: string | null;
  addressLine: string;
  postalCode: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// Order Item
export interface OrderItem {
  id: string;
  orderId?: string;
  bookId?: string | null;
  paperId?: string | null;
  bookTitle: string;
  paperName: string | null;
  paperPrice: string | number;
  quantity: number;
  subtotal: string | number;
  paper: BookPaper | null;
}

// Payment
export interface Payment {
  id: string;
  orderId: string;
  gateway: "COD" | "CARD" | "BANK_TRANSFER" | "MOBILE_BANKING";
  amount: number;
  currency: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  createdAt: string;
}

// Order
export interface Order {
  id: string;
  userId?: string;
  addressId?: string;
  orderNumber: string;
  subtotal: string | number;
  discount: string | number;
  shipping: string | number;
  total: string | number;
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNED";
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  paymentMethod: "COD" | "CARD" | "BANK_TRANSFER" | "MOBILE_BANKING";
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  orderItems: OrderItem[];
  payments: Payment[];
  address?: OrderAddress;
}

// Order Address (nested in order detail response)
export interface OrderAddress {
  id: string;
  name: string;
  phone: string;
  district: string;
  addressLine: string;
}

// Receipt (returned by verify endpoint)
export interface Receipt {
  id: string;
  orderId: string;
  receiptNumber: string;
  pdfUrl: string;
  qrCodeUrl: string;
  generatedAt: string;
  order: {
    orderNumber: string;
    total: string | number;
    status: string;
    orderItems: OrderItem[];
  };
}

// Setting
export interface Setting {
  id: string;
  key: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

// Auth User
export interface AuthUser {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  avatar?: string;
}

// Auth Response
export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

// Book Tree (for /books/tree endpoint)
export interface BookTreeBook {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  priceRange: PriceRange | null;
}

export interface BookTreeSubject {
  subject: {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
  };
  books: BookTreeBook[];
}

export interface BookTreePublication {
  publication: {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
  };
  subjects: BookTreeSubject[];
}

export type BookTreeResponse = BookTreePublication[];
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  bio?: string;
  favoriteGenres?: string[];
}