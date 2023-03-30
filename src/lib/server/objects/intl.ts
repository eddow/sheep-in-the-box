import { prop } from '@typegoose/typegoose';
import { languages, textTypes, type Language, type TextType } from '$sitb/constants';
import { map } from '../db';
export { languages, textTypes, Language, TextType }

export default class Intl {
	@prop({type: String, required: true, trim: true})
	key!: string;
	
	@prop({type: String, required: true, trim: true, enum: Object.keys(languages)})
	lng!: Language

	@prop({type: String, trim: true})
	text!: string;

	@prop({type: Number})
	ts!: number;
}

const col = map(Intl).db.collections.intls;
if(col) {
	col.createIndex({ key: 1, lng: 1 }, { unique: true });
	col.createIndex({ lng: 1 });
}

export class IntlKey {
	@prop({type: String, required: true, unique: true, trim: true})
	key!: string;
	
	@prop({type: String, trim: true})
	role!: string;

	@prop({type: String, enum: textTypes})
	type!: TextType;
}