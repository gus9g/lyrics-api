import { Router } from 'express';
import { LyricController } from '../controllers/lyric.controller';

const router = Router();
const controller = new LyricController();

router.post('/', controller.create);
router.get('/', controller.findAll);
router.get('/:id', controller.findById);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.remove);

export default router;