const express = require('express');
const router = express.Router();

const { getTreatments, getTreatmentById, createTreatment, updateTreatment, deleteTreatment } = require('../controllers/treatmentController');
const { protect } = require('../middleWare/authMiddleware');

router.get('/', protect, getTreatments);
router.get('/:id', protect, getTreatmentById);
router.post('/', protect, createTreatment);
router.put('/:id', protect, updateTreatment);
router.delete('/:id', protect, deleteTreatment);

module.exports = router;
