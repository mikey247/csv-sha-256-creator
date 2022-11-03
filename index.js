#!/usr/bin/env node

/**
 * csv-sha256-calculator
 * take the CSV provided by the teams, and generate a CHIP-0007 compatible json, calculate the sha256 of the json file and append it to each line in the csv (as a filename.output.csv)
 *
 * @author mike umeokoli <mikey24-7.xyz>
 */

const fs = require('fs');
const csvToJson = require('convert-csv-to-json');
const crypto = require('crypto');
const { Parser } = require('json2csv');

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

console.log(flags);

let json = csvToJson.fieldDelimiter(',').getJsonFromCsv(flags.file);

for (let i = 0; i < json.length; i++) {
	const hash = crypto
		.createHash('sha256')
		.update(JSON.stringify(json[i]))
		.digest('hex');
	if (json[i].Name !== '') {
		json[i].Hash = hash;
	}
}

let title = flags.file.split('/')[1].split('.')[0];

fs.writeFile(`${title}.json`, JSON.stringify(json), () => {
	console.log('json writing finished');
	const fields = [
		'SeriesNumber',
		'Filename',
		'Name',
		'Description',
		'Gender',
		'Attributes',
		'UUID',
		'Hash'
	];

	const opts = { fields };

	try {
		const parser = new Parser(opts);
		const csv = parser.parse(json);
		fs.writeFile(`${title}.output.csv`, csv, () => {
			console.log('hashing finished');
		});
	} catch (err) {
		console.error(err);
	}
});

//
(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);

	debug && log(flags);
})();
