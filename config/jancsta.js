const bcrypt = require('bcryptjs');
const JancstaPort = function (token, x) {

    let control = ''

    switch (x) {
        case 'super': control = 'Master' ; break;
        case 'sub': control = 'Subscriber' ; break;
    }

    
    if (token) {
        bcrypt.compare(control, token).then((res) => {
            if (res) {
                console.log('sucess');
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
module.exports = JancstaPort;