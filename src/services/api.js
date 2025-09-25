/**
 * API service for handling booking-related requests
 */

/**
 * Create a new booking
 * @param {Object} bookingData - Data for the booking
 * @param {string} bookingData.company_id - ID of the company
 * @param {string} bookingData.start_time - Start time in ISO format
 * @param {Array} bookingData.services - Array of services
 * @param {string} bookingData.notes - Optional booking notes
 * @returns {Promise} - Promise that resolves with the booking data
 */
export const createBooking = async (bookingData) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/v1/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || `Error ${response.status}: Could not complete booking`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Booking creation failed:', error);
    throw error;
  }
};
