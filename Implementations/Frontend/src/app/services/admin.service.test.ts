import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { AxiosResponse } from 'axios';

vi.mock('./apiClient', () => ({
  default: { get: vi.fn() },
}));

import apiClient from './apiClient';
import { getAdminStats } from './admin.service';

const mockOrderStats = {
  todayOrders: 5,
  monthOrders: 50,
  totalOrders: 200,
  todayRevenue: 120,
  monthRevenue: 1200,
};

const mockRestaurantStats = {
  totalRestaurants: 10,
  activeRestaurants: 8,
};

function fakeResponse<T>(data: T): AxiosResponse<{ success: boolean; data: T }> {
  return { data: { success: true, data } } as AxiosResponse<{ success: boolean; data: T }>;
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe('getAdminStats', () => {
  it('returns merged order and restaurant stats on success', async () => {
    vi.mocked(apiClient.get)
      .mockResolvedValueOnce(fakeResponse(mockOrderStats))
      .mockResolvedValueOnce(fakeResponse(mockRestaurantStats));

    const result = await getAdminStats();

    expect(result.orders).toEqual(mockOrderStats);
    expect(result.restaurants).toEqual(mockRestaurantStats);
    expect(apiClient.get).toHaveBeenCalledTimes(2);
  });

  it('rejects when the order-stats call fails', async () => {
    vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('network error'));

    await expect(getAdminStats()).rejects.toThrow('network error');
  });

  it('rejects when the restaurant-stats call fails', async () => {
    vi.mocked(apiClient.get)
      .mockResolvedValueOnce(fakeResponse(mockOrderStats))
      .mockRejectedValueOnce(new Error('restaurant service down'));

    await expect(getAdminStats()).rejects.toThrow('restaurant service down');
  });
});
