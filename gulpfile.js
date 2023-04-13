import gulp from 'gulp';
import rename from 'gulp-rename';

const { src, dest } = gulp;

export default function defaultTask(cb) {
	console.log('loggin');
	cb();
}

export function postinstall(cb) {
	/*src([
		'./node_modules/jquery/dist/jquery*.js',
		'./node_modules/file-upload-with-preview/dist/style.css'
	])
		.pipe(rename(path=> {
			if(path.basename === 'style')
				path.basename = 'file-upload-with-preview';
		}))
		.pipe(dest('./static/modules'));*/
	cb();
}

