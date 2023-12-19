import { Router } from 'express';
import { Controllers } from '../../controllers';

const router = Router();

router.get('/', Controllers.Page.getAllPages);
router.get('/:id', Controllers.Page.getPage);
router.post('/', Controllers.Page.createPage);

const pageRoutes = router;

export default pageRoutes;
