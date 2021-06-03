const { response } = require('express');
const express = require('express');
const router = express.Router();
const request = require('request');
const Plan = require('../models/plan');

let options = {
	url: 'https://cloud.magic-plan.com/api/v2/workgroups/plans?sort=Plans.update_date&direction=desc',
	headers: {
		accecpt: 'application/json',
		key: 'dd0c7925689fbf4f2083412497c30f9d2445',
		customer: '5c7ef0e0b4132',
	},
};

router.get('/', async (req, res) => {
	let query = Plan.find();
	if (req.query.searchTerm != null && req.query.searchTerm != '') {
		query = query.regex('name', new RegExp(req.query.searchTerm, 'i'));
	}
	req.plans = await query.limit(300).exec();
	res.render('index', {
		plans: req.plans,
		searchTerm: req.query.searchTerm,
	});
});

router.get('/refresh/:page', async (req, res) => {
	options.url += `&page=${req.params.page}`;
	request.get(options, async (err, response, body) => {
		if (err) return;
		const info = JSON.parse(body);

		for (const plan of info.data.plans) {
			const newPlan = new Plan({
				id: plan.id,
				name: plan.name,
				address: {
					street: plan.address.street,
					street_number: plan.address.street_number,
					postal_code: plan.address.postal_code,
					city: plan.address.city,
					country: plan.address.country,
					longitude: plan.address.longitude,
					latitude: plan.address.latitude,
				},
				created_by: {
					id: plan.created_by.id,
					firstname: plan.created_by.firstname,
					lastname: plan.created_by.lastname,
					email: plan.created_by.email,
				},
				creation_date: plan.creation_date,
				update_date: plan.update_date,
				thumbnail_url: plan.thumbnail_url,
				public_url: plan.public_url,
			});

			const existingPlan = await Plan.find({ id: plan.id }).exec();
			// If the Plan does not exist create a new one and save it
			if (existingPlan.length == 0) {
				try {
					const newP = await newPlan.save();
					// console.log('Creating new Plan');
					// console.log(newP);
				} catch (e) {
					console.error(e);
				}
			} else {
				// If the Plan already exists but information changed
				if (new Date(plan.update_date).getTime() > new Date(existingPlan.update_date).getTime()) {
					existingPlan = newPlan;
					try {
						const updatedPlan = await existingPlan.save();
						console.log('Updated Plan');
						console.log(updatedPlan);
					} catch (e) {
						console.error(e);
					}
				} else {
					// If the Plan exists and is up to date
					console.log('Terminating at Plan');
					console.log(plan);
					break;
				}
			}
		}
	});

	res.redirect('/');
});

module.exports = router;
