function notFound(req, res) {
  res.status(404).json({ error: 'Resource not found' });
}

module.exports = notFound;
