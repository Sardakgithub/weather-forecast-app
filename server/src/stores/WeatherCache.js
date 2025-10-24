import { Schema, model } from 'mongoose';

const WeatherCacheSchema = new Schema({
  key: { type: String, required: true, unique: true, index: true },
  data: { type: Schema.Types.Mixed, required: true },
  expireAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
}, { timestamps: true });

export const WeatherCache = model('WeatherCache', WeatherCacheSchema);
