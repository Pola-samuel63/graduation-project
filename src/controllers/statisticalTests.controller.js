import { calcSingle_t_test } from '../services/statisticalTests.service';

export const single_t_test = (req, res) => {
  const data = calcSingle_t_test(req, res);

  return res.json({ message: 'Upload successful', data });
};
