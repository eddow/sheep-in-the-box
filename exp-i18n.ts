import { addTree } from './src/lib/utils';
import { englishDefault } from './src/svemantic/i18n';

const flatV: any = {}, trf = <any>{...englishDefault, cmd: englishDefault.button};
delete trf.button;
addTree(flatV, trf);
console.log('=== KEYS ===');
console.log(JSON.stringify(
	Object.keys(flatV).map(key=> ({key, role: '', type: ''})),
	null, '\t'
));
console.log('=== INTLS ===');
console.log(JSON.stringify(
	Object.keys(flatV).map(key=> ({key, lng: 'en', text: flatV[key]})),
	null, '\t'
));