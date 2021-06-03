export default function(_) {
  // determine range
  const maxb = _.maxbins || 20;
  const base = _.base || 10;
  const logb = Math.log(base);
  const div  = _.divide || [5, 2];

  let min  = _.extent[0];
  let max  = _.extent[1];
  let step;
  let level;
  let minstep;
  let v;
  let i;
  let n;

  const span = _.span || (max - min) || Math.abs(min) || 1;

  if (_.step) {
    // if step size is explicitly given, use that
    step = _.step;
  } else if (_.steps) {
    // if provided, limit choice to acceptable step sizes
    v = span / maxb;
    for (i=0, n=_.steps.length; i < n && _.steps[i] < v; ++i);
    step = _.steps[Math.max(0, i-1)];
  } else {
    // else use span to determine step size
    level = Math.ceil(Math.log(maxb) / logb);
    minstep = _.minstep || 0;
    step = Math.max(
      minstep,
      Math.pow(base, Math.round(Math.log(span) / logb) - level)
    );

    // increase step size if too many bins
    while (Math.ceil(span/step) > maxb) { step *= base; }

    // decrease step size if allowed
    for (i=0, n=div.length; i<n; ++i) {
      v = step / div[i];
      if (v >= minstep && span / v <= maxb) step = v;
    }
  }

  // update precision, min and max
  v = Math.log(step);
  const precision = v >= 0 ? 0 : ~~(-v / logb) + 1;
  const eps = Math.pow(base, -precision - 1);
  if (_.nice || _.nice === undefined) {
    v = Math.floor(min / step + eps) * step;
    min = min < v ? v - step : v;
    max = Math.ceil(max / step) * step;
  }

  return {
    start: min,
    stop:  max === min ? min + step : max,
    step:  step
  };
}
