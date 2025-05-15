const express = require('express');
const router = express.Router();

// Dummy data
const facilities = [
  {
    id: '1',
    name: 'City Clinic',
    location: 'Downtown',
    type: 'Healthcare',
    description: '24/7 clinic with emergency services',
    contactInfo: '123-456-7890',
  },
  {
    id: '2',
    name: 'Sunshine Sports Center',
    location: 'East Side',
    type: 'Recreational',
    description: 'Indoor and outdoor sports facilities',
    contactInfo: '987-654-3210',
  },
];

// GET /api/facilities?search=term
router.get('/', (req, res) => {
  const search = req.query.search?.toLowerCase() || '';
  const result = facilities.filter(f => f.name.toLowerCase().includes(search));
  res.json(result);
});

// GET /api/facilities/:id
router.get('/:id', (req, res) => {
  const facility = facilities.find(f => f.id === req.params.id);
  if (!facility) return res.status(404).json({ message: 'Facility not found' });
  res.json(facility);
});

module.exports = router;
