import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pageRoutes from './routes/page.routes.js';
import contactRoutes from './routes/contact.routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
// Also serve src/assets as a fallback temporarily or move them. 
// We will move them to public/images later.
// app.use('/assets', express.static(path.join(__dirname, '../src/assets')));

// Routes
app.use('/', pageRoutes);
app.use('/contact', contactRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).send('Page Not Found');
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
