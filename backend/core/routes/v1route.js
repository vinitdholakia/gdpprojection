module.exports = (express) => {
    let versionRouter = express.Router();

    versionRouter.get('/graph', dataservice.getGraphData);

    return versionRouter;
}