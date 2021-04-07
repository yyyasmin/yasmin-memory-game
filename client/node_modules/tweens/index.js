var tweenr = require('tweenr')();

function setTween(subject, target, duration, easing, callback) {

  target.duration = (duration / 1000);
  target.easing = easing;

  var tween = tweenr.to(subject, target);

  if (callback) {
    tween.on('complete', function() {
      callback();
    });
  }

  return tween;
}

function clearTween(tweenObject) {
  tweenObject.cancel();
}

module.exports.setTween = setTween;
module.exports.clearTween = clearTween;
