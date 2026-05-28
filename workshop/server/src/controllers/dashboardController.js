const dashboardService = require('../services/dashboardService');

function getSummary(req, res) {
  try {
    res.json(dashboardService.getSummary());
  } catch (err) {
    console.error('Error fetching dashboard summary:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard summary.' });
  }
}

function getAnalytics(req, res) {
  try {
    res.json(dashboardService.getAnalytics());
  } catch (err) {
    console.error('Error fetching analytics:', err);
    res.status(500).json({ error: 'Failed to fetch analytics.' });
  }
}

module.exports = { getSummary, getAnalytics };
