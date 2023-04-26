import { PrimaryKey, SerializedPrimaryKey } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";

export class BaseEntity {
	@PrimaryKey({hidden: true})
	_id!: ObjectId;
}

export class IdedBaseEntity {
	@PrimaryKey()
	_id!: ObjectId;

	@SerializedPrimaryKey()
	id!: string;
}