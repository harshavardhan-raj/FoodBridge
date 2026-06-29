const axios = require('axios');

/**
 * Geocode an address using OpenStreetMap's Nominatim API.
 * @param {string} address - The physical address to geocode.
 * @returns {Promise<number[]|null>} - A promise that resolves to [longitude, latitude] or null if not found.
 */
const geocodeAddress = async (address) => {
    try {
        if (!address) return null;

        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                q: address,
                format: 'json',
                limit: 1
            },
            headers: {
                'User-Agent': 'FoodBridge-App (contact@foodbridge.example.com)'
            }
        });

        if (response.data && response.data.length > 0) {
            const { lon, lat } = response.data[0];
            return [parseFloat(lon), parseFloat(lat)];
        }

        return null;
    } catch (error) {
        console.error('Geocoding error:', error.message);
        return null;
    }
};

module.exports = { geocodeAddress };
