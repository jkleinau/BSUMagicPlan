const { response } = require('express')
const express = require('express')
const router = express.Router()
const request = require('request')

const options={
    url:'https://cloud.magic-plan.com/api/v2/workgroups/plans',
    key: 'dd0c7925689fbf4f2083412497c30f9d2445',
    customer: '5c7ef0e0b4132'
}

router.get('/', (req,res)=>{
    res.render('index')
})

router.get('/refresh', (req, res) =>{
    request.get(options, (err, response, body)=>{
        if(err) console.error(err)
        const info = JSON.parse(body)
        console.log(info)
    })
})



module.exports = router