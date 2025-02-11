const chokidar = require('chokidar');
const fse = require('fs-extra');
const path = require('path');

// Configure these paths as needed
const SOURCE_DIR = './types';
const DEST_DIR_1 = './apps/desktop/types';
const DEST_DIR_2 = './apps/interface/types';

// Initialize watcher
const watcher = chokidar.watch(SOURCE_DIR, {
	persistent: true,
	ignoreInitial: false
});

// Copy function
const copyToDestinations = async (filepath) => {
	try {
		const relativePath = path.relative(SOURCE_DIR, filepath);
		const dest1 = path.join(DEST_DIR_1, relativePath);
		const dest2 = path.join(DEST_DIR_2, relativePath);

		await Promise.all([
			fse.copy(filepath, dest1),
			fse.copy(filepath, dest2)
		]);

		console.log(`Copied ${relativePath} to both destinations`);
	} catch (error) {
		console.error('Error copying file:', error);
	}
};

// Watch events
watcher
	.on('add', copyToDestinations)
	.on('change', copyToDestinations)
	.on('unlink', async (filepath) => {
		const relativePath = path.relative(SOURCE_DIR, filepath);
		await Promise.all([
			fse.remove(path.join(DEST_DIR_1, relativePath)),
			fse.remove(path.join(DEST_DIR_2, relativePath))
		]);
		console.log(`Removed ${relativePath} from both destinations`);
	});

console.log(`Watching ${SOURCE_DIR} for changes...`);
