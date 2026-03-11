import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { AxiosResponse } from 'axios';

vi.mock('./apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
  handleApiError: vi.fn((e: unknown) => (e instanceof Error ? e.message : 'error')),
}));

import apiClient from './apiClient';
import restaurantService from './restaurant.service';

function fakeResponse<T>(data: T): AxiosResponse<{ success: boolean; data: T }> {
  return { data: { success: true, data } } as AxiosResponse<{ success: boolean; data: T }>;
}

const mockRestaurant = {
  id: '1',
  name: 'Test Restaurant',
  cuisineType: 'THAI',
  address: '123 Test St',
  phoneNumber: '+66-2-111-2222',
  isActive: true,
  averageRating: 4.5,
};

const mockPaginated = {
  content: [mockRestaurant],
  page: 0,
  size: 20,
  totalElements: 1,
  totalPages: 1,
};

beforeEach(() => {
  vi.resetAllMocks();
});

// ========== getAllRestaurants ==========
describe('getAllRestaurants', () => {
  it('returns paginated restaurant list', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce(fakeResponse(mockPaginated));

    const result = await restaurantService.getAllRestaurants();

    expect(result).toEqual(mockPaginated);
    expect(apiClient.get).toHaveBeenCalledOnce();
  });

  it('rethrows on API error', async () => {
    vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('Network Error'));

    await expect(restaurantService.getAllRestaurants()).rejects.toThrow();
  });
});

// ========== searchRestaurants ==========
describe('searchRestaurants', () => {
  it('returns filtered restaurants', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce(fakeResponse(mockPaginated));

    const result = await restaurantService.searchRestaurants({ searchTerm: 'Thai' });

    expect(result).toEqual(mockPaginated);
    expect(apiClient.get).toHaveBeenCalledOnce();
  });

  it('rethrows on API error', async () => {
    vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('server error'));

    await expect(restaurantService.searchRestaurants({})).rejects.toThrow();
  });
});

// ========== getRestaurantById ==========
describe('getRestaurantById', () => {
  it('returns a single restaurant', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce(fakeResponse(mockRestaurant));

    const result = await restaurantService.getRestaurantById('1');

    expect(result).toEqual(mockRestaurant);
    expect(apiClient.get).toHaveBeenCalledOnce();
  });

  it('rethrows on API error', async () => {
    vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('not found'));

    await expect(restaurantService.getRestaurantById('99')).rejects.toThrow();
  });
});

// ========== getRestaurantsByCuisine ==========
describe('getRestaurantsByCuisine', () => {
  it('returns restaurants by cuisine', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce(fakeResponse(mockPaginated));

    const result = await restaurantService.getRestaurantsByCuisine('THAI');

    expect(result).toEqual(mockPaginated);
  });

  it('rethrows on API error', async () => {
    vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('error'));

    await expect(restaurantService.getRestaurantsByCuisine('THAI')).rejects.toThrow();
  });
});

// ========== getCuisineTypes ==========
describe('getCuisineTypes', () => {
  it('returns list of cuisine types', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce(fakeResponse(['THAI', 'ITALIAN']));

    const result = await restaurantService.getCuisineTypes();

    expect(result).toEqual(['THAI', 'ITALIAN']);
  });

  it('rethrows on API error', async () => {
    vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('error'));

    await expect(restaurantService.getCuisineTypes()).rejects.toThrow();
  });
});

// ========== getTopRatedRestaurants ==========
describe('getTopRatedRestaurants', () => {
  it('returns top rated restaurants', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce(fakeResponse([mockRestaurant]));

    const result = await restaurantService.getTopRatedRestaurants(5);

    expect(result).toEqual([mockRestaurant]);
  });

  it('rethrows on API error', async () => {
    vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('error'));

    await expect(restaurantService.getTopRatedRestaurants()).rejects.toThrow();
  });
});

// ========== getRestaurantMenu ==========
describe('getRestaurantMenu', () => {
  it('returns menu items array from paginated response', async () => {
    const menuItem = { id: '1', restaurantId: '1', name: 'Pad Thai', description: 'Noodles', price: 120, isAvailable: true };
    vi.mocked(apiClient.get).mockResolvedValueOnce(fakeResponse({ content: [menuItem] }));

    const result = await restaurantService.getRestaurantMenu('1');

    expect(result).toEqual([menuItem]);
  });

  it('rethrows on API error', async () => {
    vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('error'));

    await expect(restaurantService.getRestaurantMenu('1')).rejects.toThrow();
  });
});
