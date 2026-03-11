/**
 * Services Index
 * 
 * Central export point for all API services
 */

export { default as apiClient, handleApiError } from './apiClient';
export type { ApiResponse, PaginatedResponse } from './apiClient';

export { default as restaurantService } from './restaurant.service';
export type {
  Restaurant,
  MenuItem,
  Address,
  SearchFilters,
} from './restaurant.service';

export { default as orderService } from './order.service';
export {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from './order.service';
export type {
  Order,
  OrderItem,
  OrderAddress,
  CreateOrderRequest,
  CreateOrderItem,
  UpdateOrderStatusRequest,
} from './order.service';
