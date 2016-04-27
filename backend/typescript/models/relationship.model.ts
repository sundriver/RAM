import * as mongoose from 'mongoose';

//todo:enum
export const status_options = [
  'Invalid', 'Pending', 'Active', 'Deleted', 'Cancelled'
];

//todo:enum
export const access_levels = [
  'Universal', 'Limited', 'Fixed', 'Legal Attorney'
];

export const relationship_types = [
  'Business', 'Online Service Provider'
];

export interface IRelationship extends mongoose.Document {
  /* A Subject is the party being effected (changed) by a transaction performed by the Delegate */
  type: string;

  subjectId: string;
  subjectName: string;
  subjectAbn: string;
  subjectRole: string;
  /** A Delegate is the party who will be interacting with government on line services on behalf of the Subject. */
  delegateId: string;
  delegateName: string;
  delegateAbn: string;
  delegateRole: string;
  /* when does thissour relationship start to be usable - this will be different to the creation timestamp */
  startTimestamp: Date;
  /* when does this relationship finish being usable */
  endTimestamp: Date;
  /* when did this relationship get changed to being finished. */
  endEventTimestamp: Date;
  /* is this relationship: Invalid (semantically incorrect)/ Pending/ Active/ Inactive*/
  status: string;
  attributes: { string: string };
  /** which agencies can see the existence of this Relationship */
  sharingAgencyIds: [string];
  /* Party's identity (including Authorisation Code) contain names,
   * but the other party may prefer setting a different name by which to remember who they are dealing with. */
  subjectsNickName: string;
  /* Party's identity (including Authorisation Code) contain names,
   * but the other party may prefer setting a different name by which to remember who they are dealing with. */
  delegatesNickName: string;

  deleted: boolean;
}
const RelationshipSchema = new mongoose.Schema({
  type: {
    type: String,
    //enum: relationship_types
  },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },
  subjectName: String,
  subjectAbn: { type: String, default: '' },
  subjectRole: String,
  delegateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },
  delegateName: String,
  delegateAbn: { type: String, default: '' },
  delegateRole: String,
  startTimestamp: Date,
  endTimestamp: Date,
  endEventTimestamp: Date,
  status: { type: String, enum: status_options },
  attributes: {},
  sharingAgencyIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Agency' }],
  subjectsNickName: String,
  delegatesNickName: String,
  deleted: { type: Boolean, default: false }
}, { timestamps: true });

export interface IRelationshipModel extends mongoose.Model<IRelationship> {
  getRelationshipById: (id: mongoose.Types.ObjectId) => mongoose.Promise<IRelationship>;
}

// called by RelationshipModel.getRelationshipById(...)
RelationshipSchema.static('getRelationshipById', (id: mongoose.Types.ObjectId) => {
  return this.RelationshipModel.findOne({ _id: id }).exec();
});

export const RelationshipModel = mongoose.model('Relationship', RelationshipSchema) as IRelationshipModel;
