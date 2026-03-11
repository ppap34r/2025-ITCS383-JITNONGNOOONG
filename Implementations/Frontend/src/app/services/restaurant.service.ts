/**
 * Restaurant Service
 * 
 * Handles all restaurant-related API calls:
 * - Fetching restaurant lists
 * - Searching restaurants
 * - Getting restaurant details
 * - Managing menus
 */

import apiClient, { ApiResponse, PaginatedResponse, handleApiError } from './apiClient';
import { API_ENDPOINTS } from '../config/api.config';

/**
 * Restaurant Type Definitions
 */
export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  cuisineType: string;
  address: Address;
  phoneNumber: string;
  openingHours?: string;
  isActive: boolean;
  averageRating: number;
  imageUrl?: string;
  minOrder?: number;
  deliveryFee?: number;
  estimatedDeliveryTime?: string;
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  latitude: number;
  longitude: number;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  isAvailable: boolean;
  preparationTime?: number;
}

export interface SearchFilters {
  searchTerm?: string;
  cuisineType?: string;
  minRating?: number;
  maxDeliveryFee?: number;
  latitude?: number;
  longitude?: number;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

/**
 * Restaurant Service Class
 */
class RestaurantService {
  /**
   * Get all restaurants with pagination
   */
  async getAllRestaurants(
    page: number = 0,
    size: number = 20,
    sortBy: string = 'name',
    sortDir: 'asc' | 'desc' = 'asc'
  ): Promise<PaginatedResponse<Restaurant>> {
    try {
      const response = await apiClient.get<ApiResponse<PaginatedResponse<Restaurant>>>(
        API_ENDPOINTS.RESTAURANTS.BASE,
        {
          params: { page, size, sortBy, sortDir },
        }
      );
      
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch restaurants:', handleApiError(error));
      throw error;
    }
  }

  /**
   * Search restaurants with filters
   */
  async searchRestaurants(filters: SearchFilters): Promise<PaginatedResponse<Restaurant>> {
    try {
      const response = await apiClient.get<ApiResponse<PaginatedResponse<Restaurant>>>(
        API_ENDPOINTS.RESTAURANTS.SEARCH,
        {
          params: filters,
        }
      );
      
      return response.data.data;
    } catch (error) {
      console.error('Failed to search restaurants:', handleApiError(error));
      throw error;
    }
  }

  /**
   * Get restaurant by ID
   */
  async getRestaurantById(id: string): Promise<Restaurant> {
    try {
      const response = await apiClient.get<ApiResponse<Restaurant>>(
        API_ENDPOINTS.RESTAURANTS.BY_ID(id)
      );
      
      return response.data.data;
    } catch (error) {
      console.error(`Failed to fetch restaurant ${id}:`, handleApiError(error));
      throw error;
    }
  }

  /**
   * Get restaurants by cuisine type
   */
  async getRestaurantsByCuisine(
    cuisineType: string,
    page: number = 0,
    size: number = 20
  ): Promise<PaginatedResponse<Restaurant>> {
    try {
      const response = await apiClient.get<ApiResponse<PaginatedResponse<Restaurant>>>(
        API_ENDPOINTS.RESTAURANTS.BY_CUISINE(cuisineType),
        {
          params: { page, size },
        }
      );
      
      return response.data.data;
    } catch (error) {
      console.error(`Failed to fetch ${cuisineType} restaurants:`, handleApiError(error));
      throw error;
    }
  }

  /**
   * Get top rated restaurants
   */
  async getTopRatedRestaurants(limit: number = 10): Promise<Restaurant[]> {
    try {
      const response = await apiClient.get<ApiResponse<Restaurant[]>>(
        API_ENDPOINTS.RESTAURANTS.TOP_RATED,
        {
          params: { limit },
        }
      );
      
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch top rated restaurants:', handleApiError(error));
      throw error;
    }
  }

  /**
   * Get restaurant menu
   */
  async getRestaurantMenu(restaurantId: string): Promise<MenuItem[]> {
    try {
      const response = await apiClient.get<ApiResponse<MenuItem[]>>(
        API_ENDPOINTS.RESTAURANTS.MENU(restaurantId)
      );
      
      return response.data.data;
    } catch (error) {
      console.error(`Failed to fetch menu for restaurant ${restaurantId}:`, handleApiError(error));
      throw error;
    }
  }

  /**
   * Get menu item details
   */
  async getMenuItem(restaurantId: string, itemId: string): Promise<MenuItem> {
    try {
      const response = await apiClient.get<ApiResponse<MenuItem>>(
        API_ENDPOINTS.RESTAURANTS.MENU_ITEM(restaurantId, itemId)
      );
      
      return response.data.data;
    } catch (error) {
      console.error(`Failed to fetch menu item ${itemId}:`, handleApiError(error));
      throw error;
    }
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

// Export singleton instance
export const restaurantService = new RestaurantService();
export default restaurantService;
