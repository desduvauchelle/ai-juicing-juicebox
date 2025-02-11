const chokidar = require('chokidar');
const fse = require('fs-extra');
const path = require('path');

// Configure these paths as needed
const SOURCE_DIR = './types';
const DEST_DIRS = [
	'./apps/desktop/types',
	'./apps/interface/types'
];

// Initialize watcher
const watcher = chokidar.watch(SOURCE_DIR, {
	persistent: true,
	ignoreInitial: false
});

// Copy function
const copyToDestinations = async (filepath) => {
	try {
		const relativePath = path.relative(SOURCE_DIR, filepath);
		const copyPromises = DEST_DIRS.map(dest =>
			fse.copy(filepath, path.join(dest, relativePath))
		);

		await Promise.all(copyPromises);
		console.log(`Copied ${relativePath} to all destinations`);
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
		const removePromises = DEST_DIRS.map(dest =>
			fse.remove(path.join(dest, relativePath))
		);
		await Promise.all(removePromises);
		console.log(`Removed ${relativePath} from all destinations`);
	});

console.log(`Watching ${SOURCE_DIR} for changes...`);
