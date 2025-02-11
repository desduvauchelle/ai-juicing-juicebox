const fse = require('fs-extra');
const path = require('path');

// Configure these paths as needed
const SOURCE_DIR = './types';
const DEST_DIRS = [
	'./apps/desktop/types',
	'./apps/interface/types'
];

const copyTypes = async () => {
	try {
		await Promise.all(
			DEST_DIRS.map(dest => fse.copy(SOURCE_DIR, dest))
		);
		console.log('Successfully copied types to all destinations');
	} catch (error) {
		console.error('Error copying files:', error);
	}
};

copyTypes();
