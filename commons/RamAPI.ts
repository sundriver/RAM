export interface IResponse {
    isError: boolean;
}

export class ErrorResponse implements IResponse {
    constructor(public errorCode: number,
        public errorMessage: string) { }

    isError: boolean = true;
}

export class ErrorResponseWithData<T> implements IResponse {
    constructor(public data: T, public errorCode: number, public errorMessage: string) { }
    isError: boolean = true;
}

export class DataResponse<T>{
    constructor(public data: T) { }
    isError: boolean = false;
}

/**
 * A RAMObject defines the common attributes that all objects in the RAM model will contain.
 *  Most objects in RAM extend off the RAMObject.
 * PK is _id(used by mongo) and (id,lastUpdatedTimestamp)
 */

type EntityID = string;

export interface IRAMObject {
    _id: EntityID;
    id: EntityID;
    lastUpdatedTimestamp: Date;
    lastUpdatedByPartyId: EntityID;
    deleteIndicator: boolean;
}

/*
 * A Party is the concept that participates in Relationships.
 * see https://books.google.com.au/books?id=_fSVKDn7v04C&lpg=PP1&dq=enterprise%20patterns%20and%20mda%20chapter%20party%20relationship&pg=RA1-PA159#v=onepage&q=enterprise%20patterns%20and%20mda%20chapter%20party%20relationship&f=false
 */
export interface IParty extends IRAMObject {
    relationshipIds: EntityID[];
    identities: IdentityValue[];
    roles: IEntityWithAttributes<string, ISharableEntityAttributeValue<string>>[];
    partyTypeInformation: ISharableEntityWithAttributes<string>;
}

export interface IRelationship extends IRAMObject {
    /** A Subject is the party being effected (changed) by a transaction performed by the Delegate */
    relationshipTypeInformation: ISharableEntityWithAttributes<string>;

    subjectPartyId: EntityID;
    subjectRoleId: EntityID;
    subjectRolePermission: IEntityWithAttributes<boolean, IEntityAttributeValue<boolean>>;
    /** A Delegate is the party who will be interacting with government on line services on behalf of the Subject. */
    delegatePartyId: EntityID;
    delegateRoleId: EntityID;
    /** when does this relationship start to be usable - this will be different to the creation timestamp */
    startTimestamp: Date;
    /** when does this relationship finish being usable */
    endTimestamp?: Date;
    /** which agencies can see the existence of this Relationship */
    sharing: IConsent[];
    /** Party's identity (including Authorisation Code) contain names,
     * but the other party may prefer setting a different name by which to remember
     * who they are dealing with. */
    subjectsNickName: string;
    /** Party's identity (including Authorisation Code) contain names,
     * but the other party may prefer setting a different name by which to remember
     * who they are dealing with. */
    delegatesNickName: string;
}

/** Most relationships are between two parties.
 * However, one of those parties may be unknown during the set-up phase for a relationship.
 * During that time the relationship will be owned by a "PendingInvitations"
 */
export interface IdentityValue extends IRAMObject {
    machine_name: string;
    human_name: string;
    identityProviderId: EntityID;
    partySpecificInfo: ISharableEntityWithAttributes<string>;
    answersToSecrets: IEntityAttributeValue<String>[];
    claimedTimestamp: Date;
    expiryTimestamp: Date;
    creatorPartyId: EntityID;
    creatorRoleDefId: EntityID;
}

export interface IdentityProvider extends IRAMObject {
    machine_name: string;
    human_name: string;
    partySepcificInfoDef: Namable[]; // e.g., driving licence #
    listOfPossibleSecrets: Namable[]; // e.g., address, date of birth and phone number
    defaultExpiryPeriodInDays: number;
}

/** A Role is some characteristic that a Party has. Roles will only likely to be collected when there is something that needs to be build into a business rule for relationships.
 *  A Role is independant of relationships, e.g. you a doctor even if you have no patients.  In essanse a Role is just a collection of attributes.
 */
interface ISharableEntityWithAttributes<T> extends IEntityWithAttributes<T, ISharableEntityAttributeValue<T>> {
    sharing: string[];          //which agencies can see the existence of this Role
}

interface IEntityWithAttributes<T, U extends IEntityAttributeValue<T>> {
    entityWithAttributeDefId: EntityID;
    attributes: U[];
}

export interface EntityWithAttributeDef extends IRAMObject, Namable {
    listOfAttributes: IAttributeDef<String>[];
}

export interface Namable {
    machine_name: string;
    human_name: string;
}
export interface IAttributeDef<T> extends Namable {
    listOfAcceptableOptions: Array<Namable>;
    isFreeText: boolean;
    isRequired: boolean;
}

interface IEntityAttributeValue<T> {
    machine_name: string;
    value: T;
}

interface ISharableEntityAttributeValue<T> extends IEntityAttributeValue<T> {
    sharing: string[];          //referencing consent id, which agencies can see the existence of this RoleAttribute
}

/** Control for sharing various different objects in the RAM database with other government
 * agencies may be set by parties in the system.  The Consent object will record what
 * which LegislativePrograms consent has been granted for sharing
 */
export interface IConsent extends IRAMObject {
    legislativeProgram: ILegislativeProgram;
}

/** A LegislativeProgram represents some course-grained grouping of functionality offered by government to citizens.
 *  Due to "Machinary of Government" changes these LegislativePrograms are moved between agencies. Generally, LegislativePrograms survive these moves, just in a newly named agency.
 */
export interface ILegislativeProgram {
    name: string;
}

export interface IName {
    givenName?: string;
    familyName?: string;
    unstructuredName?: string;
}