const mongoose = require('mongoose')
const plan = new mongoose.Schema({
    id: {
      type: String,
      required:true,
      unique:true
    },
    name: {
      type: String,
      required:true
    },
    address: {
      street: {
        type: String
      },
      street_number: {
        type: Number
      },
      postal_code: {
        type: String
      },
      city: {
        type: String
      },
      country: {
        type: String
      },
      longitude: {
        type: Number
      },
      latitude: {
        type: Number
      }
    },
    creation_date: {
      type: Date,
      required:true
    },
    update_date: {
      type: Date,
      required:true
    },
    thumbnail_url: {
      type: String
    },
    public_url: {
      type: String
    }
  })

  module.exports = mongoose.model('Plan', plan)