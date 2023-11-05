// @ts-check

/**
 * Adds two points together
 * 
 * @param {{x: number, y: number}} p1 
 * @param {{x: number, y: number}} p2 
 * @returns {{x: number, y: number}}
 */
function add(p1, p2) {
  return {x: p1.x + p2.x, y: p1.x + p2.x}
}