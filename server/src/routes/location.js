import { Router } from 'express';
import {
  reverseGeocodeHandler, searchLocationHandler,
  getRouteHandler, getRouteMatrixHandler, getLocationDetails,
} from '../controllers/locationController.js';

const router = Router();

router.get('/reverse-geocode', reverseGeocodeHandler);
router.get('/search', searchLocationHandler);
router.get('/route', getRouteHandler);
router.post('/route/matrix', getRouteMatrixHandler);
router.get('/details', getLocationDetails);

export default router;
