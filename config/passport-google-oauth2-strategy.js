
const passport = require('passport');
// requiring passport-google-strategy
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

// setting up passport-google-oauth2
passport.use(new googleStrategy({
    clientID: "810848287518-qd96at69lcatkh0csi45i5naougjbjn4.apps.googleusercontent.com",
    clientSecret: "IPurGs0n-wufZ1DN9dw54CxG",
    callbackURL: "http://localhost:8000/users/auth/google/callback"
    }, 

    function(accessToken, refreshToken, profile, done){
        // find a user
        User.findOne({email: profile.emails[0].value}).exec(function(err,user){
            if(err){console.log('error in google strategy-passport', err); return;}

            if(user){
                // if found, set this user as req.user
                return done(null, user);
            } else{
                // if not found create the user and set it as req.user
               User.create({
                   name: profile.displayName,
                   email: profile.emails[0].value,
                   password: crypto.randomBytes(20).toString('hex')
               }, function(err, user){
                   if(err){console.log('error in creating user google-strategy-passport', err); return;}

                   return done(null, user);
               })
            }
        });
    }
))