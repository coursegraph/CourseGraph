

export function levenshtein(q, s, A, B) {
  let n = q.length;
  let m = s.length;

  A.length = n + 1;
  B.length = n + 1;
  for (let i = n + 1; i-- > 0;) {
    A[i] = i;
    B[i] = 0;
  }
  for (let j = 0; j < m; ++j) {
    let x = j;
    for (let i = 0; i < n; ++i) {
      x = B[i + 1] = Math.min(
        Math.min(x, A[i + 1]) + 1,
        q[i] != s[j] ? A[i] + 1 : 0);
    }
    let C = A;
    A = B;
    B = C;
  }
  return A[n];
}

export function match(q) {
  return (course) => {
    course.searchString = (course.label + course.title + course.descr).toLowerCase();
    return fuzzyMatch(q.toLowerCase(), course.searchString);
  };
}


function fuzzyMatch(q, s) {
  let i = s.length;
  let j = q.length;
  while (j !== 0 && i >= j) {
    if (s[i - 1] === q[j - 1]) {
      --j;
    }
    --i;
  }
  return j === 0;
}


// def lev (a, b):
//     n, m = len(a), len(b)
//     row, prev = [0] * (n + 1), [0] * (n + 1)
//     for i in range(n):
//         prev[i] = i
//     for j in range(m):
//         x = j
//         for i in range(n):
//             x = row[i + 1] = min(
//                 min(x, prev[i + 1]) + 1,
//                 prev[i] + 1 if a[i] != b[j] else 0)
//         row, prev = prev, row
//     return prev[n]

