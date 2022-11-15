import { prop } from '@typegoose/typegoose';
import { languages, type Language } from './constants';
export { languages, Language }

export default class Intl {
	@prop({type: String, required: true, trim: true})
	key!: string;
	
	@prop({type: String, required: true, enum: Object.keys(languages)})
	lng!: Language

	@prop({type: String, required: true, trim: true})
	text!: string;

	@prop({type: String, required: true, trim: true})
	test!: string;

	@prop({type: String, required: true, trim: true})
	role!: string;
}