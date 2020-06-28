// rendering home page
module.exports.home = function(req, res){
    return res.render('home', {
        title: "Authenticity"
    });
}

// module.exports.actionName = function(req, res){}