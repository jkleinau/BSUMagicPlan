const express = require('express');
const fetch = require('node-fetch');
const Plan = require('../models/plan');
const router = express.Router();
const fs = require('fs');
const { MAGIC_URL, headers } = require('../utils/urls');

router.get('/', (req, res) => {
	res.redirect('/');
});

router.get('/refresh/:id', async (req, res) => {
	const response = await fetch(`${MAGIC_URL}/plans/get/${req.params.id}`, {
		method: 'GET',
		headers: headers,
	}).catch((e) => console.error(e));
	const json = await response.json().catch((e) => console.error(e));
	console.log(json);

	res.redirect('/');
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
