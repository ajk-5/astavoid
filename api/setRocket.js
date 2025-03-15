function setRocket() {
    let rocketBackgroundColor;
  if (rocketEnabled) {
    rocketEnabled = false;
    rocketBackgroundColor= "lightgray";

  } else {
    rocketEnabled = true;
    rocketBackgroundColor="Darkgray";
  }
  return rocketBackgroundColor;
}

module.exports = setRocket;

