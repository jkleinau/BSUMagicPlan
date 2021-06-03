const express = require('express');
const Plan = require('../models/plan');
const router = express.Router();

router.get('/', (req, res) => {
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
