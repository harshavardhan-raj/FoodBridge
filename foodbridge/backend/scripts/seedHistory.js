const mongoose = require('mongoose');
const dotenv = require('dotenv');
const HistoricalTrend = require('../models/HistoricalTrend');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedHistory = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // 1. Find the target provider (e.g., 'greenhotel' or the first provider)
        let provider = await User.findOne({ role: 'provider', name: /greenhotel/i });
        if (!provider) {
            provider = await User.findOne({ role: 'provider' });
        }

        if (!provider) {
            console.error('No provider found to seed data for. Please register a provider first.');
            process.exit(1);
        }

        console.log(`Seeding data for provider: ${provider.name} (${provider._id})`);

        // 2. Read the JSON data
        const dataPath = path.join(__dirname, '../data/ml_training_data.json');
        const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

        // 3. Clear existing trends for this provider to avoid duplicates/confusion
        await HistoricalTrend.deleteMany({ providerId: provider._id });

        // 4. Map and Aggregate Trends
        // The service expects aggregated trends, so we process the records
        const trendMap = {};

        const dayMap = {
            'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
            'Thursday': 4, 'Friday': 5, 'Saturday': 6
        };

        for (const record of rawData) {
            const dayOfWeek = dayMap[record.day_of_week];
            const hourOfDay = parseInt(record.time_of_day.split(':')[0]);
            const key = `${dayOfWeek}-${hourOfDay}`;

            if (!trendMap[key]) {
                trendMap[key] = {
                    providerId: provider._id,
                    dayOfWeek,
                    hourOfDay,
                    totalSurplus: 0,
                    surplusOccurrenceCount: 0,
                    totalObservations: 0,
                    categories: new Set(),
                    peakSeasonFactor: record.event_flag === 'festival' ? 1.5 : 1.0
                };
            }

            trendMap[key].totalObservations++;
            if (record.surplus_quantity > 0) {
                trendMap[key].surplusOccurrenceCount++;
                trendMap[key].totalSurplus += record.surplus_quantity;
                trendMap[key].categories.add(record.category);
            }
        }

        // 5. Save to MongoDB
        for (const key in trendMap) {
            const t = trendMap[key];
            const trend = new HistoricalTrend({
                providerId: t.providerId,
                dayOfWeek: t.dayOfWeek,
                hourOfDay: t.hourOfDay,
                avgSurplusQuantity: t.surplusOccurrenceCount > 0 ? t.totalSurplus / t.surplusOccurrenceCount : 0,
                surplusOccurrenceCount: t.surplusOccurrenceCount,
                totalObservations: t.totalObservations,
                commonCategories: Array.from(t.categories),
                peakSeasonFactor: t.peakSeasonFactor,
                lastUpdated: new Date()
            });
            await trend.save();
        }

        console.log('Successfully seeded ML training data!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
};

seedHistory();
