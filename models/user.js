var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

const SALT_WORK_FACTOR = 10;
const bcrypt = require('bcryptjs');


// Schéma d'un utilisateur
var UserSchema = new mongoose.Schema({
    first_name : String, 
    last_name : String, 
    admin : {type : Boolean, default: false },
    email : { type : String, unique : true, required : true },
    password: String,
    status: { type : String, required : true, enum : ['admin','active', 'pending','inactive'], default: 'pending' },
    photoURL: String
});

//commentaire de test

UserSchema.pre('save', function(next) {
    let user = this;
    //sel
    if (user.password){
    
        bcrypt.genSalt(SALT_WORK_FACTOR, function(err,salt) {
            if(err) return next(err);
        
            //hash
            bcrypt.hash(user.password,salt,function(err,hash) {
                if(err) return next(err);
    
                user.password = hash;
                next();
            })
        })


    }

    else {

        next();

    }

    
   
})


UserSchema.methods.validPassword = function(password){

    return bcrypt.compareSync(password, this.password);

}

UserSchema.methods.generateJwt = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 30); //nombre de jours

    return jwt.sign({
      _id: this._id,
      email: this.email,
      first_name: this.first_name,
      last_name: this.last_name,
      admin: this.admin,
      status : this.status,
      exp: parseInt(expiry.getTime() / 1000),
    }, "ARIE_SELINGER");
  };

// Create the model


const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;