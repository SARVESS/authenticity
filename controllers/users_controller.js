const User = require('../models/user');
// require bcrypt for password hashing
const bcrypt = require('bcrypt');
const saltRounds = 10;
 
module.exports.profile = function(req, res){
    return res.render('user_profile', {
         title: 'User Profile',
    });
}

// update basic details
module.exports.update = function(req, res){
    if(req.user.id == req.params.id){
        User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
            req.flash('success', 'Profile Updated Successfully!');
            return res.redirect('back');
        });
    } else {
       req.flash('error', 'Unauthorized to change Profile!');
       return res.status(401).send('Unauthorized');
    }
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

// render the update password page 
module.exports.updatePasswordPage = function(req, res){
    return res.render('update_password', {
        title: "Update Password"
    })
}

// update old password 
module.exports.updatePassword = async function(req, res){
       try{
             if(req.body.new_password != req.body.confirm_password){
                 console.log('password not matched');
                 req.flash('error', 'Passwords do not match!');
                 return res.redirect('back');
             }

             let userFind = await User.findById(req.params.id);
             let compare = await bcrypt.compare(req.body.old_password, userFind.password);
             if(!compare){
                console.log('password old is wrong');
                 req.flash('error', 'Old password is wrong!');
                 return res.redirect('back');
             } else{
                 let savingnewPassword = await bcrypt.hash(req.body.new_password, saltRounds);
                 let change = await User.findByIdAndUpdate(req.params.id, { password: savingnewPassword });
                 req.flash('success' , 'Password Updated Successfully!');
                 return res.redirect('/users/profile');
             }

       } catch(err){
           console.log('Error in updating password');
           req.flash('error', 'Error in Updating Password');
           return res.redirect('back');
       }

}