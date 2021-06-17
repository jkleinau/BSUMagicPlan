const { response } = require('express');
const express = require('express');
const router = express.Router();
const Plan = require('../models/plan');
const fetch = require('node-fetch');

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
		req.query.searchTerm = req.query.searchTerm.trim();
		query = query.regex('name', new RegExp(req.query.searchTerm, 'i'));
	}
	req.plans = await query.limit(50).sort({ update_date: 'desc' }).exec();
	res.render('index', {
		plans: req.plans,
		searchTerm: req.query.searchTerm,
	});
});

router.get('/refresh', async (req, res) => {
	let succes = true;
	let i = 1;
	while (succes) {
		succes = await reload_projects(i);
		i += 1;
	}

	res.redirect('/');
});

async function reload_projects(page) {
	const response = await fetch(
		`https://cloud.magic-plan.com/api/v2/workgroups/plans?sort=Plans.update_date&direction=desc&page=${page}`,
		{
			method: 'GET',
			headers: {
				accecpt: 'application/json',
				key: 'dd0c7925689fbf4f2083412497c30f9d2445',
				customer: '5c7ef0e0b4132',
			},
		}
	).catch((err) => console.error(err));
	const resJson = await response.json().catch((err) => console.error(err));
	const plans = resJson.data.plans;
	for (const plan of plans) {
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

		const existingPlan = await Plan.find({ id: plan.id })
			.exec()
			.catch((err) => console.error(err));
		// If the Plan does not exist create a new one and save it
		if (existingPlan.length == 0) {
			// console.log('saving new plan: ' + newPlan.name);
			await newPlan.save().catch((err) => console.error(err));
		} else {
			// If the Plan already exists but information changed
			if (new Date(plan.update_date).getTime() > new Date(existingPlan.update_date).getTime()) {
				// console.log('updating existing plan: ' + existingPlan.name);
				existingPlan = newPlan;
				const updatedPlan = await existingPlan.save().catch((err) => console.error(err));
			} else {
				// If the Plan exists and is up to date
				// console.log('Terminating at plan ' + plan.name);
				return false;
			}
		}
	}
	return resJson.data.paging.next_page;
}

module.exports = router;
