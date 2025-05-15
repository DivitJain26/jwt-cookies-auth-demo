const express = require('express');
const cors = require('cors');
const facilityRoutes = require('./routes/facilityRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/facilities', facilityRoutes);

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
