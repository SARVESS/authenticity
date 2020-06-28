const User = require('../models/user');
// require bcrypt for password hashing
const bcrypt = require('bcrypt');
const saltRounds = 10;
 
module.exports.profile = function(req, res){
    return res.render('user_profile', {
        title: 'User Profile'
    })
}


// render the sign up page
module.exports.signUp = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }


    return res.render('user_sign_up', {
        title: "Authenticity | Sign Up"
    })
}


// render the sign in page
module.exports.signIn = function(req, res){

    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Authenticity | Sign In"
    })
}

// get the sign up data
module.exports.create = async function(req, res){
      if (req.body.password != req.body.confirm_password){
          req.flash('error', 'Passwords do not match!');
          return res.redirect('back');
      }

     try {

        let user = await User.findOne({email: req.body.email});

        if (!user){
            req.body.password = await bcrypt.hash(req.body.password, saltRounds);    
            let createdUser = await User.create(req.body); 
            req.flash('success', 'Signed Up Succesfully!');
            return res.redirect('/users/sign-in');
        } else {
            req.flash('error', 'User Already exists!');
            return res.redirect('back');
        } 

     } catch(err) {
        console.log('Error', err);
        return;
     }
      
}


// sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged In Successfully');
    return res.redirect('/users/profile');
}

module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success', 'You have logged out!');
    
    return res.redirect('/');
}