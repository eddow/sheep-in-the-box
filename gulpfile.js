import gulp from "gulp";

const { src, dest, symlink } = gulp;

export default function defaultTask(cb) {
	console.log('loggin');
	cb();
}

export function postinstall(cb) {

	src([
		'./node_modules/jquery/dist/jquery*.js',
	]).pipe(dest('./static/modules'));
	cb();
}

