const { response } = require('express')
const express = require('express')
const router = express.Router()
const request = require('request')
const Plan = require('../models/plan')

const options={
    url:'https://cloud.magic-plan.com/api/v2/workgroups/plans?page=3',
    headers:{
        accecpt: 'application/json',
        key: 'dd0c7925689fbf4f2083412497c30f9d2445',
        customer: '5c7ef0e0b4132'  
    }
    
}

router.get('/', async(req,res)=>{
    let query = Plan.find()
    if(req.query.searchTerm != null && req.query.searchTerm != ''){
        query = query.regex('name', new RegExp(req.query.searchTerm, 'i'))
    }
    req.plans = await query.limit(100).exec()
    res.render('index',{
        plans: req.plans,
        searchTerm: req.query.searchTerm
    })
})

router.get('/refresh', async (req, res) =>{
    const info = {}
    request.get(options, (err, response, body)=>{
        if(err) return
        const info = JSON.parse(body)

        info.data.plans.forEach(async plan => {
            const newPlan = new Plan({
                id: plan.id,
                name: plan.name,
                // address = plan.address,
                creation_date: plan.creation_date,
                update_date: plan.update_date,
                thumbnail_url: plan.thumbnail_url,
                public_url: plan.public_url
            })
            try {
                const newP = await newPlan.save()
            } catch (error) {
                console.error(error)
            }
        });
    })
    res.redirect('/')
})



module.exports = router