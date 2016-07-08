import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {RAMModelHelper} from '../../commons/ram-model-helper';
import {IIdentity} from '../../../../commons/RamAPI2';

@Component({
    selector: 'page-header',
    templateUrl: 'page-header.component.html',
    directives: []
})

export class PageHeaderComponent {

    @Input() public tab: string;
    @Input() public identity: IIdentity;

    constructor(private router: Router,
                private modelHelper: RAMModelHelper) {
    }

    public title(): string {
        return this.identity ? this.modelHelper.displayNameForIdentity(this.identity) : 'Loading ...';
    }

    public goToRelationshipsPage = () => {
        if (this.identity) {
            this.router.navigate(['/relationships', encodeURIComponent(this.identity.idValue)]);
        }
    };

    public goToGiveAuthorisationPage = () => {
        if (this.identity) {
            this.router.navigate(['/relationships/add', encodeURIComponent(this.identity.idValue)]);
        }
    };

    public goToGetAuthorisationPage = () => {
        if (this.identity) {
            this.router.navigate(['/relationships/add/enter', encodeURIComponent(this.identity.idValue)]);
        }
    };

}