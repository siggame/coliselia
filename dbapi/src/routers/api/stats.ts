import * as express from 'express';

let router = express.Router();

router.get('/', (req, res) => {
    res.status(400).send('UNIMPLEMENTED');
});

export { router as stats };
