import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connect } from 'mongoose';
import weatherRouter from './routes/weather.js';
import { config } from './utils/env.js';

const app = express();

app.use(helmet());
app.use(express.json());

const allowedOrigins = config.ALLOWED_ORIGINS.split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : '*'}));

app.use(morgan('dev'));

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/weather', weatherRouter);

// Global error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    error: {
      message: err.message || 'Internal Server Error',
      details: err.details || undefined,
    }
  });
});

async function start() {
  try {
    await connect(config.MONGODB_URI);
    const port = config.PORT;
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
  } catch (e) {
    console.error('Failed to start server', e);
    process.exit(1);
  }
}

start();
