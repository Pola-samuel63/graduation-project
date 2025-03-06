import { calcLinearReg } from '../services/regression.service';

export const linearReg = (req, res) => {
  const data = calcLinearReg(req);

  return res.json({ message: 'reg done successfully', data });
};
