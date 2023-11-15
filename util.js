// @ts-check

/**
 * @typedef Point2D
 * @prop {number} x
 * @prop {number} y
 */

/**
 * Adds two points together
 * 
 * @param {Point2D} p1 
 * @param {Point2D} p2 
 * @returns {Point2D}
 */
function add(p1, p2) {
  return {x: p1.x + p2.x, y: p1.x + p2.x}
}