import * as express from "express";

let router = express.Router();

router.get("/:id", (req, res) => {
    res.status(400).send("UNIMPLEMENTED");
});

router.post("/api/v2/match/", function(req, res){
    res.status(400).send("UNIMPLEMENTED");
});

export { router as MatchRouter };