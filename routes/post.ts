import express, { Request, Response, Router } from 'express';
const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
    res.json({message: 'UNIMPLEMENTED: List of Posts'});
});

export default router;
