import { Entity, PrimaryKey, SerializedPrimaryKey } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";

export class BaseEntity {
	@PrimaryKey({hidden: true, type: ()=> ObjectId})
	_id!: ObjectId;
}

export class IdedBaseEntity {
	@PrimaryKey({type: ()=> ObjectId})
	_id!: ObjectId;

	@SerializedPrimaryKey({type: ()=> String})
	id!: string;
}