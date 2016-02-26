/// <reference path="../_BackendTypes.ts" />

'use strict';

import * as express from "express";
import {DataResponse, IndividualBusinessAuthorisation, BusinessName} from "../../../commons/RamAPI";
import {Persistence, IRamConf} from "../ram/ServerAPI";
import * as enums from "../../../commons/RamEnums";

export function RelationsCtrl(persistence: Persistence) {
    const router: express.Router = express.Router();

    router.get('/123', async (req: express.Request, res: express.Response, next: express.NextFunction):Promise<DataResponse<Array<BusinessName>>> => {
        var businessInfo = await persistence.getBusinessInformation(["123"])
        res.send(businessInfo);
        return businessInfo;
    });
        return router;
}
