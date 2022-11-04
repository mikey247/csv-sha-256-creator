#!/usr/bin/env node

/**
 * csv-sha256-calculator
 * take the CSV provided by the teams, and generate a CHIP-0007 compatible json, calculate the sha256 of the json file and append it to each line in the csv (as a filename.output.csv)
 *
 * @author mike umeokoli <mikey24-7.xyz>
 */

const fs = require('fs');
const crypto = require('crypto');
const { Parser } = require('json2csv');
const csv = require('fast-csv');

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

let items = [];
let NFTs = [];
let teamName = '';
const final = [];
let title = flags.file.split('.')[0];

fs.createReadStream(flags.file)
	.pipe(csv.parse({ headers: true }))
	.on('data', line => {
		if (line['TEAM NAMES'].toLowerCase().startsWith('team')) {
			teamName = line['TEAM NAMES'];
		}

		const hash = crypto
			.createHash('sha256')
			.update(JSON.stringify(line))
			.digest('hex');
		line.Hash = hash;

		if (line['Filename']) {
			//the Valid NFTs
			NFTs.push({ ...line, Team: teamName });
			//all the data
			items.push(line);
		} else {
			items.push(line);
		}
	})
	.on('close', () => {
		fs.mkdir('./nfts', () => {
			console.log('Created nfts folder for all your NFTs🍾');
		});

		NFTs.map(nft => {
			const nftData = {
				Format: 'CHIP-0007',
				Filename: nft['Filename'],
				Name: nft['Name'],
				Description: nft['Description'],
				Minting_tool: nft['Team'],
				Sensitive_content: false,
				Series_number: parseInt(nft['Series Number']),
				Series_total: NFTs.length,
				Attributes: [
					{
						trait_type: 'gender',
						value: nft['Gender']
					}
				],
				Collection: {
					name: 'Zuri NFT Tickets for Free Lunch',
					id: 'b774f676-c1d5-422e-beed-00ef5510c64d',
					attributes: [
						{
							type: 'description',
							value: 'Rewards for accomplishments during HNGi9.'
						}
					]
				},
				UUID: nft['UUID'],
				Hash: nft['Hash']
			};

			if (nft['Attributes']) {
				let nftAttributes = nft['Attributes'].split(';');

				nftAttributes.map(attribute => {
					let attributeKeyValue = attribute.split(':');
					nftData['Attributes'].push({
						trait_type: attributeKeyValue[0]
							? attributeKeyValue[0].trim()
							: attributeKeyValue[0],
						value: attributeKeyValue[1]
							? attributeKeyValue[1].trim()
							: attributeKeyValue[1]
					});
				});
			}

			final.push(nftData);

			fs.writeFile(
				`nfts/${nftData['Filename']}.json`,
				JSON.stringify(nftData),
				() => {}
			);
		});

		const fields = Object.keys(final[0]);

		const opts = { fields };

		const parser = new Parser(opts);
		const csv = parser.parse(final);

		fs.mkdir('./data', () => {
			console.log('Created data folder🚀');
		});

		fs.writeFile(`data/${title}.output.csv`, csv, () => {
			console.log('Updated CSV created✅⚡---check data folder');
		});

		fs.writeFile(`data/${title}.json`, JSON.stringify(final), () => {
			console.log('JSON Registry finished🏃🏾🦧💨--check data folder');
		});
	})
	.on('error', err => {
		console.log('Oops! Something went wrong', err);
	});

//
(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);
	debug && log(flags);
})();
