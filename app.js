require('dotenv').config();
const express = require('express');
const heroRoutes = require('./routes/heroRoutes');
const { logger, notFound, errorHandler } = require('./middlewares');

const app = express();

app.use(express.json());
app.use(logger);
app.use('/', heroRoutes);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
