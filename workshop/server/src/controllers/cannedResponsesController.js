const cannedResponsesService = require('../services/cannedResponsesService');

function getAllCannedResponses(req, res) {
  try {
    res.json(cannedResponsesService.getAll());
  } catch (err) {
    console.error('Error fetching canned responses:', err);
    res.status(500).json({ error: 'Failed to fetch canned responses.' });
  }
}

module.exports = { getAllCannedResponses };
