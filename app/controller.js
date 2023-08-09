const { usersState } = require('./updateState');

const checkState = ({ userId }) => {
    if(usersState[userId]) return true;
    return false;
};

module.exports = {
    checkState
}