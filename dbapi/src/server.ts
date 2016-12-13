import * as bodyParser from 'body-parser';
import * as config from 'config';
import * as express from 'express';
import * as winston from 'winston';

import * as routers from './routers';

let app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
});

app.use((req, res, next) => {
    winston.info(`${req.method}\t${req.path}\t${JSON.stringify(req.body)}`);
    next();
});

// use apis
app.use('/api/v2/user/', routers.api.user);
app.use('/api/v2/team/', routers.api.team);
app.use('/api/v2/schedule', routers.api.schedule);

app.listen(config.get('port'), () => {
    winston.info(`Listening on port ${config.get('port')}`);
});

export { app as server };
