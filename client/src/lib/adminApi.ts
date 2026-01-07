const API_BASE = '/api/admin';

export interface Booking {
  id: number;
  user: { id: number; email: string };
  schedule: {
    id: number;
    movie: { id: number; title: string; imageUrl: string | null } | null;
    hall: { id: number; name: string } | null;
    date: string;
    time: string;
  } | null;
  zone: { id: number; name: string } | null;
  ticketType: { id: number; name: string } | null;
  seat: string;
  finalPrice: number;
  status: string;
  bookingTime: string;
  cancelledAt: string | null;
  cancelledBy: number | null;
}

export interface Schedule {
  id: number;
  movie: { id: number; title: string; imageUrl: string | null; duration: number } | null;
  hall: { id: number; name: string; type: string; isClosed: boolean } | null;
  date: string;
  time: string;
  isActive: boolean;
  createdAt: string;
  bookingsCount: number;
  cancelledBookingsCount: number;
}

export interface Hall {
  id: number;
  name: string;
  capacity: number;
  type: string;
  isClosed: boolean;
  zones: { id: number; name: string; basePrice: number }[];
  activeSchedulesCount: number;
}

export interface MovieStatistics {
  movieId: number;
  movieTitle: string;
  movieImageUrl: string | null;
  totalSchedulesCount: number;
  confirmedTicketsCount: number;
  cancelledTicketsCount: number;
  revenue: number;
  cancelledRevenue: number;
}

export interface DateReport {
  date?: string;
  weekStart?: string;
  weekEnd?: string;
  year?: number;
  month?: number;
  monthName?: string;
  confirmedTicketsCount: number;
  cancelledTicketsCount: number;
  revenue: number;
  cancelledRevenue: number;
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Ошибка запроса' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const adminApi = {
  // Билеты
  async getBookings(params?: {
    scheduleId?: number;
    userId?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Booking[]> {
    const queryParams = new URLSearchParams();
    if (params?.scheduleId) queryParams.append('scheduleId', params.scheduleId.toString());
    if (params?.userId) queryParams.append('userId', params.userId.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    const url = `${API_BASE}/bookings${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return fetchWithAuth(url);
  },

  async getCancelledBookings(): Promise<Booking[]> {
    return fetchWithAuth(`${API_BASE}/bookings/cancelled`);
  },

  async cancelBooking(id: number): Promise<{ message: string }> {
    return fetchWithAuth(`${API_BASE}/bookings/${id}/cancel`, { method: 'POST' });
  },

  // Расписание
  async getSchedules(params?: {
    movieId?: number;
    hallId?: number;
    isActive?: boolean;
    startDate?: string;
    endDate?: string;
  }): Promise<Schedule[]> {
    const queryParams = new URLSearchParams();
    if (params?.movieId) queryParams.append('movieId', params.movieId.toString());
    if (params?.hallId) queryParams.append('hallId', params.hallId.toString());
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    const url = `${API_BASE}/schedules${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return fetchWithAuth(url);
  },

  async updateSchedule(id: number, data: {
    movieId?: number;
    hallId?: number;
    date?: string;
    time?: string;
    isActive?: boolean;
  }): Promise<{ message: string }> {
    return fetchWithAuth(`${API_BASE}/schedules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async toggleScheduleActive(id: number): Promise<{ message: string; isActive: boolean }> {
    return fetchWithAuth(`${API_BASE}/schedules/${id}/toggle-active`, { method: 'PATCH' });
  },

  async deleteSchedule(id: number): Promise<{ message: string }> {
    return fetchWithAuth(`${API_BASE}/schedules/${id}`, { method: 'DELETE' });
  },

  // Залы
  async getHalls(): Promise<Hall[]> {
    return fetchWithAuth(`${API_BASE}/halls`);
  },

  async toggleHallClosed(id: number): Promise<{ message: string; isClosed: boolean }> {
    return fetchWithAuth(`${API_BASE}/halls/${id}/toggle-closed`, { method: 'PATCH' });
  },

  // Статистика
  async getScheduleStatistics(params?: {
    scheduleId?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<any[]> {
    const queryParams = new URLSearchParams();
    if (params?.scheduleId) queryParams.append('scheduleId', params.scheduleId.toString());
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    const url = `${API_BASE}/statistics/schedules${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return fetchWithAuth(url);
  },

  async getMovieStatistics(params?: {
    movieId?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<MovieStatistics[]> {
    const queryParams = new URLSearchParams();
    if (params?.movieId) queryParams.append('movieId', params.movieId.toString());
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    const url = `${API_BASE}/statistics/movies${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return fetchWithAuth(url);
  },

  async getDateReports(params?: {
    startDate?: string;
    endDate?: string;
    period?: 'day' | 'week' | 'month';
  }): Promise<DateReport[]> {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.period) queryParams.append('period', params.period);

    const url = `${API_BASE}/statistics/reports${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return fetchWithAuth(url);
  },
};

