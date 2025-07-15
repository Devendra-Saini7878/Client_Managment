import express from 'express';
import { createForm, getForms, updateForm, deleteForm, getChannelSummary } from '../controllers/formController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, createForm);
router.get('/', auth, getForms);
router.put('/:id', auth, updateForm);
router.delete('/:id', auth, deleteForm);
router.get('/summary', auth, getChannelSummary);

export default router;
