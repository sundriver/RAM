import {conf} from '../bootstrap';
import {Seeder} from './seed';
import {ProfileProvider} from '../models/profile.model';
import {PartyType} from '../models/party.model';
import {IdentityType, IdentityLinkIdScheme} from '../models/identity.model';

// seeder .............................................................................................................

/* tslint:disable:no-any */
/* tslint:disable:max-func-body-length */
export class BobSmithIdentitySeeder {

    public static async load() {
        try {

            Seeder.log('\nInserting Sample Identity - Bob Smith:\n'.underline);

            if (!conf.devMode) {

                Seeder.log('Skipped in prod mode'.gray);

            } else {

                Seeder.bobsmith_name = await Seeder.createNameModel({
                    givenName: 'Bob',
                    familyName: 'Smith'
                } as any);

                Seeder.bobsmith_dob = await Seeder.createSharedSecretModel({
                    value: '01/01/2000',
                    sharedSecretType: Seeder.dob_sharedSecretType
                } as any);

                Seeder.bobsmith_profile = await Seeder.createProfileModel({
                    provider: ProfileProvider.MyGov.code,
                    name: Seeder.bobsmith_name,
                    sharedSecrets: [Seeder.bobsmith_dob]
                } as any);

                Seeder.bobsmith_party = await Seeder.createPartyModel({
                    partyType: PartyType.Individual.code
                } as any);

                Seeder.log('');

                Seeder.bobsmith_identity_1 = await Seeder.createIdentityModel({
                    rawIdValue: 'bobsmith_identity_1',
                    identityType: IdentityType.LinkId.code,
                    defaultInd: true,
                    linkIdScheme: IdentityLinkIdScheme.MyGov.code,
                    profile: Seeder.bobsmith_profile,
                    party: Seeder.bobsmith_party
                } as any);

            }

        } catch (e) {
            Seeder.log('Seeding failed!');
            Seeder.log(e);
        }
    }

}
