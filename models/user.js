  const mongoose = require('mongoose');


  const Schema = mongoose.Schema;

  const UserSchema = new Schema({

    username: {

      type: String,

      required: true
    },

    email: {

      type: String,

      required: true,

      unique: true
    },

    password: {

      type: String
    },

    respositories: [

      {

        default: [],

        type: Schema.Types.ObjectId,

        ref: "Repository"
      }
    ],

    followedUsers: [

      {

        default: [],

        type: Schema.Types.ObjectId,

        ref: "User"
      }
    ],


    starRepositories: [

      {

        default: [],

        type: Schema.Types.ObjectId,

        ref: "Repository"
      }
    ]

  });


  const User = mongoose.model('User', UserSchema);

module.exports =  User;




