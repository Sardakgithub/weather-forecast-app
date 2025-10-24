import { Router } from 'express';
import { z } from 'zod';
import { getCurrentWeather, getForecast } from '../services/weatherService.js';

const router = Router();

const querySchema = z.object({
  city: z.string().min(1, 'city is required')
});

router.get('/current', async (req, res, next) => {
  try {
    const { city } = querySchema.parse(req.query);
    const data = await getCurrentWeather(city);
    res.json(data);
  } catch (err) {
    if (err instanceof z.ZodError) {
      err.status = 400;
      err.details = err.flatten();
    }
    next(err);
  }
});

router.get('/forecast', async (req, res, next) => {
  try {
    const { city } = querySchema.parse(req.query);
    const data = await getForecast(city);
    res.json(data);
  } catch (err) {
    if (err instanceof z.ZodError) {
      err.status = 400;
      err.details = err.flatten();
    }
    next(err);
  }
});

export default router;
