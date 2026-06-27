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

// Book
export interface Book {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  isbn: string;
  price: number;
  discountPrice: number | null;
  publicationDate: string;
  edition: string;
  language: string;
  stock: boolean;
  stockAmount: number;
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
  quantity: number;
  book: Book;
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
  country: string;
  division: string;
  district: string;
  area: string;
  addressLine: string;
  postalCode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// Order Item
export interface OrderItem {
  id: string;
  orderId: string;
  bookId: string;
  bookTitle: string;
  bookPrice: number;
  quantity: number;
  subtotal: number;
}

// Payment
export interface Payment {
  id: string;
  orderId: string;
  gateway: "COD" | "CARD" | "BANK_TRANSFER" | "MOBILE_BANKING";
  amount: number;
  currency: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  createdAt: string;
}

// Order
export interface Order {
  id: string;
  userId: string;
  addressId: string;
  orderNumber: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  paymentMethod: "COD" | "CARD" | "BANK_TRANSFER" | "MOBILE_BANKING";
  notes: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  payments: Payment[];
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
}

// Auth Response
export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

// User Profile (extended user info)
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