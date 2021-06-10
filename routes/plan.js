const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const Plan = require('../models/plan');
const { spawn } = require('child_process');
const router = express.Router();
const fs = require('fs');
const { MAGIC_URL, headers } = require('../utils/urls');

router.get('/', (req, res) => {
	res.redirect('/');
});

router.get('/refresh/:id', async (req, res) => {
	// Getting the plan details from MagicPlan
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
		console.log('saved');
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
			const plan = await Plan.findOne({ id: json.data.plan.id }).catch((err) => console.error(err));
			plan.xml_file = true;
			const savPlan = await plan.save();
			fs.unlink(path_pre, function (err) {
				if (err) console.error(err);
			});
			console.log('conversion completed');
		}
	});

	res.redirect('/');
});

router.get('/download/:id', async (req, res) => {
	try {
		const plan = await Plan.findOne({ id: req.params.id });
		await res.download('./public/processed/' + plan.id + '.xml', plan.name + '-aufmass.xml', async (err) => {
			if (err) {
				plan.xml_file = false;
				await plan.save();
				console.error(err);
				res.end();
			}
		});
	} catch (e) {
		console.error(e);
	}
});

router.get('/:id', async (req, res) => {
	try {
		const plan = await Plan.findOne({ id: req.params.id }).exec();
		res.render('plan/show', { plan: plan });
	} catch (e) {
		console.error(e);
		res.redirect('/');
	}
});

module.exports = router;
