const bcrypt = require('bcryptjs');
const moment = require('moment');

module.exports = function(token) {

    let date = moment().format('MM/DD/YYYY');
    let compareThis = `${date}secret`;
    if (token) {
        bcrypt.compare(compareThis, token).then((res) => {
            if (res) {
                this.bool = true;
            } else {
                this.bool = false;
            }
        })
            .catch((err) => {
                console.log('err in jancstaPort: ', err);
            });
    } else {
        return false;
    }
    
}
