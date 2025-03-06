import express from 'express';
const router = express.Router();

import userRoute from './user.route';
import testsRoute from './statisticalTests.route';
import regressionRoute from './regression.route';
/**
 * Function contains Application routes
 *
 * @returns router
 */
const routes = () => {
  router.get('/', (req, res) => {
    res.json('Welcome');
  });
  router.use('/users', userRoute);
  router.use('/tests', testsRoute);
  router.use('/regression', regressionRoute);

  return router;
};

export default routes;
