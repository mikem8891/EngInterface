// @ts-check

/**
 * Gauss-Seidel Method
 * A x = b
 * 
 * @param {number[][]} A row major matrix
 * @param {number[]} x initial guess and result
 * @param {number[]} b 
 * @param {number} N number of interations
 */
function GaussSeidel(A, x, b, N){
  const n = x.length;
  console.assert(n == b.length, "size of x and b do not match");
  for (let r=0; r<n; r++) {
    console.assert(A[r].length == n, "size of A and x do not match");
    console.assert(A[r][r] != 0, "diagonal element of A is 0");
  }
  for (let k=0; k<N; k++) { // iterations
    for (let j=0; j<n; j++) { 
      let sum = 0;
      for (let i=0; i<j; i++) {
        sum += A[j][i] * x[i];
      }
      for (let i=j+1; i<n; i++) {
        sum += A[j][i] * x[i];
      }
      x[j] = (b[j] - sum) / A[j][j];
    }
  }
  return x;
}

/* 
test();
function test(){
  let A = [ [ 16,  3],
            [ 7, -11]];
  let b = [11, 13];
  let x = [1, 1];
  console.log(GaussSeidel(A, x, b, 6));
  console.log(x);
  A = [ [10, -1,  2,  0],
        [-1, 11, -1,  3],
        [ 2, -1, 10, -1],
        [ 0,  3, -1,  8]];
  b = [6, 25, -11, 15];
  x = [0, 0, 0, 0];
  console.log(GaussSeidel(A, x, b, 4));
}
 */