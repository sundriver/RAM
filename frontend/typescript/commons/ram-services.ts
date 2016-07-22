import {Injectable} from '@angular/core';

import {RAMRestService} from '../services/ram-rest.service';
import {RAMModelHelper} from './ram-model-helper';
import {RAMRouteHelper} from './ram-route-helper';
import {BannerService} from '../components/commons/banner/banner.service';

@Injectable()
export class RAMServices {

    constructor(public rest: RAMRestService,
                public model: RAMModelHelper,
                public route: RAMRouteHelper,
                public banner: BannerService) {
    }

}