import { projects } from '../data/projects.js';

export const renderHome = (req, res) => {
  res.render('pages/index', { projects });
};
