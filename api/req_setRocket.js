
function setRocket(rocketEnabled) {
let rocketBackgroundColor;

    if (rocketEnabled) {
        rocketEnabled = false;
        rocketBackgroundColor = "lightgray";
    }
    else {
        rocketEnabled = true;
        rocketBackgroundColor = "darkgray";
    }
    return rocketBackgroundColor;

};
module.exports = setRocket;
