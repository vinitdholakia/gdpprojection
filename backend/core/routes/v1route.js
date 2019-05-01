var dataService = require('./../services/dataservice').router;
module.exports = (express) => {
    let versionRouter = express.Router();
    versionRouter.get('/graph', dataService.getGraphData);
    return versionRouter;
}