function tail(xs: any) {
  if (is_pair(xs)) {
    return xs[1];
  } else {
    throw new Error(
      'tail(xs) expects a pair as argument xs, but encountered ' +
        stringify(xs),
    );
  }
}

function head(xs: any) {
  if (is_pair(xs)) {
    return xs[0];
  } else {
    throw new Error(
      'head(xs) expects a pair as argument xs, but encountered ' +
        stringify(xs),
    );
  }
}

function stream_tail(stream) {
  return tail(stream)();
}

function stream_ref(s, n) {
  return n === 0 ? head(s) : stream_ref(stream_tail(s), n - 1);
}
function stream_map(f, s) {
  return is_null(s)
    ? null
    : pair(f(head(s)), () => stream_map(f, stream_tail(s)));
}

function stream_filter(p, s) {
  return is_null(s)
    ? null
    : p(head(s))
    ? pair(head(s), () => stream_filter(p, stream_tail(s)))
    : stream_filter(p, stream_tail(s));
}

function stream_for_each(fun, s) {
  if (is_null(s)) {
    return true;
  } else {
    fun(head(s));
    return stream_for_each(fun, stream_tail(s));
  }
}
