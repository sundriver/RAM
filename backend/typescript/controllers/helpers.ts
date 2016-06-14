import {logger} from '../logger';
import {Response, Request} from 'express';
import {IResponse, ErrorResponse, SearchResult, HrefValue} from '../../../commons/RamAPI';
import * as _ from 'lodash';

export function sendResource<T>(res: Response) {
    'use strict';
    return (doc: T): T => {
        if (doc) {
            res.status(200);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(doc, null, 4));
        }
        return doc;
    };
}

export function sendList<T extends HrefValue<U>, U>(res: Response) {
    'use strict';
    return async (results: Promise<T>[]): Promise<T[]> => {
        const resolvedResults = await Promise.all<T>(results);
        res.status(200);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(resolvedResults, null, 4));
        return resolvedResults;
    };
}

export function sendSearchResult<T extends HrefValue<U>, U>(res: Response) {
    'use strict';
    return async (results: SearchResult<Promise<T>>): Promise<SearchResult<T>> => {
        const resolvedResults = new SearchResult(results.totalCount, await Promise.all<T>(results.list));
        res.status(200);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(resolvedResults, null, 4));
        return resolvedResults;
    };
}

// @deprecated
export function sendDocument<T>(res: Response) {
    'use strict';
    return (doc: T): T => {
        if (doc) {
            const response: IResponse<T> = {
                data: doc
            };
            res.status(200);
            res.json(response);
        }
        return doc;
    };
}

export function validateReqSchema<T>(req: Request, schema: Object): Promise<Request> {
    'use strict';
    return new Promise<Request>((resolve, reject) => {
        req.checkParams(schema);
        const errors = req.validationErrors(false) as { msg: string }[];
        if (errors) {
            const errorMsgs = errors.map((e) => e.msg);
            reject(errorMsgs);
        } else {
            resolve(req);
        }
    });
}

type ValidationError = {
    errors: { [index: string]: ValidationError };
    message: string;
}

export function sendError<T>(res: Response) {
    'use strict';
    return (error: string | Error | ValidationError | string[]) => {
        logger.error(error.toString());
        switch (error.constructor.name) {
            case 'Array':
                res.status(400);
                res.json(new ErrorResponse(error as string[]));
                break;
            case 'String':
                res.status(500);
                res.json(new ErrorResponse(error as string));
                break;
            case 'MongooseError':
                res.status(400);
                res.json(new ErrorResponse(
                    _.values<string>(_.mapValues((error as ValidationError).errors, (v) => v.message))
                ));
                break;
            case 'Error':
                res.status(500);
                res.json(new ErrorResponse((error as Error).message));
                break;
            default:
                res.status(500);
                res.json(new ErrorResponse(error.toString()));
                break;
        }
    };
}

export function sendNotFoundError<T>(res: Response) {
    'use strict';
    return (doc: T): T => {
        if (!doc) {
            res.status(404);
            res.json(new ErrorResponse('Can\'t find the requested resource.'));
        }
        return doc;
    };
}