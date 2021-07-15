const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const xml2js = require('xml2js');
const Plan = require('../models/plan');
const { spawn } = require('child_process');

const router = express.Router();
const fs = require('fs');
const { MAGIC_URL, headers } = require('../utils/urls');

router.get('/', (req, res) => {
	res.redirect('/');
});

router.get('/download/:id', async (req, res) => {
	try {
		// console log the current time

		const response = await fetch(`${MAGIC_URL}/plans/get/${req.params.id}`, {
			method: 'GET',
			headers: headers,
		}).catch((e) => console.error(e));

		const json = await response.json().catch((e) => console.error(e));

		// console.log(json);
		// saving the xml as a file
		const path_pre = `public/preprocessed/${json.data.plan.id}.xml`;
		const path_post = `public/processed/${json.data.plan.id}.xml`;

		fs.writeFile(path_pre, json.data.plan_detail.magicplan_format_xml, function (err) {
			if (err) throw err;
			// console.log('saved');
		});

		const py_converter = spawn('python', [path.resolve('./python/main.py'), path_pre, path_post]);

		py_converter.stdout.on('data', (data) => {
			console.log(`${data}`);
		});

		py_converter.stderr.on('data', (data) => {
			console.error(`${data}`);
		});

		py_converter.on('close', async (code) => {
			if (code != 0) console.log('conversion failed with code: ' + code);
			else {
				// const plan = await Plan.findOne({ id: json.data.plan.id }).catch((err) => console.error(err));
				// plan.xml_file = true;
				// const savPlan = await plan.save();

				res.download(
					'./public/processed/' + json.data.plan.id + '.xml',
					json.data.plan.name + '-aufmass.xml',
					async (err) => {
						if (err) {
							// plan.xml_file = false;
							// await plan.save();
							console.error(err);
							res.end();
						}
					}
				);

				fs.unlink(path_pre, function (err) {
					if (err) console.error(err);
				});

				// console.log('conversion completed');
			}
		});

		// const plan = await Plan.findOne({ id: req.params.id });
	} catch (e) {
		console.error(e);
	}
});

router.get('/:id', async (req, res) => {
	try {
		const plan = await Plan.findOne({ id: req.params.id }).exec();

		const params = new URLSearchParams();
		params.append('key', 'dd0c7925689fbf4f2083412497c30f9d2445');
		params.append('customer', '5c7ef0e0b4132');
		params.append('planid', plan.id);

		const response = await fetch('https://cloud.sensopia.com/listfiles.php', {
			method: 'POST',
			body: params,
		});
		const data = await response.text();
		const json = await xml2js.parseStringPromise(data);

		let files = [];
		if (json.MagicPlanService.status == '0') {
			files = json.MagicPlanService.file;
		} else {
			files = [];
		}

		res.render('plan/show', { plan: plan, files: files });
	} catch (e) {
		console.error(e);
		res.redirect('/');
	}
});

module.exports = router;
