const bcrypt = require('bcryptjs');
module.exports = function (token, x) {

    let control = ''
    console.log('x param passed to jancstaport: ', x);
    switch (x) {
        case 'super': control = 'Master' ; break;
        case 'sub': control = 'Subscriber' ; break;
    }

    
    if (token) {
        bcrypt.compare(control, token).then((res) => {
            if (res) {
                console.log('sucess, tokens match');
                return true;
            } else {
                console.log('no match');
               return false;
            }
        })
            .catch((err) => {
                console.log('err in jancstaPort: ', err);
            });
    } else {
        return false;
    }
    
}
