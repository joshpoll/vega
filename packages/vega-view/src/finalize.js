/**
 * Finalize a View instance that is being removed.
 * Cancel any running timers.
 * Remove all external event listeners.
 * Remove any currently displayed tooltip.
 */
export default function() {
  var tooltip = this._tooltip;
  var timers = this._timers;
  var listeners = this._eventListeners;
  var n;
  var m;
  var e;

  n = timers.length;
  while (--n >= 0) {
    timers[n].stop();
  }

  n = listeners.length;
  while (--n >= 0) {
    e = listeners[n];
    m = e.sources.length;
    while (--m >= 0) {
      e.sources[m].removeEventListener(e.type, e.handler);
    }
  }

  if (tooltip) {
    tooltip.call(this, this._handler, null, null, null);
  }

  return this;
}
