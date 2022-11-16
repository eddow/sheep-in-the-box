import { prop } from '@typegoose/typegoose';
import { languages, type Language } from '../../constants';
import { map } from '../db';
export { languages, Language }

export default class Intl {
	@prop({type: String, required: true, trim: true})
	key!: string;
	
	@prop({type: String, required: true, trim: true})
	lng!: Language

	@prop({type: String, trim: true})
	text!: string;

	@prop({type: String, trim: true})
	role!: string;
}

let col = map(Intl).db.collections.intls;
col.createIndex({ key: 1, lng: 1 }, { unique: true });
col.createIndex({ lng: 1 });