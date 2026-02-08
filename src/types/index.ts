// Auth
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface ForgotPasswordRequest {
  email: string;
}

// User
export interface User {
  _id: string;
  email: string;
  role: 'Customer' | 'Coach' | 'Admin';
  firstName: string;
  lastName: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Coach Profile
export interface CoachProfile {
  _id: string;
  userId: string | User;
  bio: string;
  specialties: string[];
  experienceYears: number;
  certifications: string[];
  socialLinks: Record<string, string>;
  averageRating: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Product
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  images: string[];
  category: 'supplements' | 'equipment' | 'apparel' | 'accessories';
  stock: number;
  isActive: boolean;
  averageRating: number;
  reviewCount: number;
  sku?: string;
  specifications?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  images?: string[];
  category: string;
  stock?: number;
  sku?: string;
  specifications?: Record<string, string>;
}

// Workout (Free)
export interface FreeWorkout {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  duration: number;
  calories: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkoutRequest {
  title: string;
  description: string;
  videoUrl?: string;
  difficulty: string;
  tags?: string[];
  duration: number;
  calories: number;
}

// Nutrition (Free)
export interface FreeNutrition {
  _id: string;
  title: string;
  content: string;
  imageUrl: string;
  tags: string[];
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNutritionRequest {
  title: string;
  content: string;
  imageUrl?: string;
  tags?: string[];
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

// Media
export interface PresignedUrlRequest {
  fileName: string;
  fileType: string;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  fileUrl: string;
}

// API
export interface ApiError {
  message: string;
  statusCode: number;
}

// Dashboard (mock)
export interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  totalSubscriptions: number;
  subscriptionsChange: number;
  activeUsers: number;
  activeUsersChange: number;
  newUsers: number;
  newUsersChange: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}
