// @ts-check

/**
 * @typedef Point2D
 * @prop {number} x
 * @prop {number} y
 */

/**
 * @typedef GeoConstraint2D
 * @prop {string} type constraint type
 * @prop {Point2D[]} points points the constraint applies to
 * @prop {Array<(function(): number)>} constraintEqs equation that is zero when 
 * the constraint is satisfied
 * @prop {Array<Array<(function(): number)>>} constraintGrad deritative of the 
 * constraint
 */

/**
 * Represents a 2D geometric system of points and constraints
 */
class GeometricSystem2D {

  constructor() {
    /** @type {Point2D[]} */
    this.points = [];
    /** @type {GeoConstraint2D[]} */
    this.constraints = [];
  }


  applyConstraints() {
    /**@type {number[]} */
    let constraintVec = [];
    /**@type {number[][]} */
    let constraintJac = [];
    for (let i=0; i<this.constraints.length; i++) {
      let constEqs   = this.constraints[i].constraintEqs;
      let constGrads = this.constraints[i].constraintGrad;
      if (constEqs.length != constGrads.length)
        throw new Error("amount of constraint equations and gradients do not match");
      for (let j=0; j<constEqs.length; j++) {
        if (constGrads[j].length != 2*this.constraints[i].points.length)
          throw new Error("amount of gradients and points do not match");
        constraintVec.push(constEqs[j]());
        constraintJac.push([]);
        // TODO
      }
    }
  }

  /**
   * @param {Point2D} point 
   * @param {number} value 
   * @returns {GeoConstraint2D}
   */
  static constFixedX(point, value) {
    return {
      type: "fixed x",
      points: [point],
      constraintEqs: [() => point.x - value],
      constraintGrad: [[() => 1, () => 0]]
    }
  }

  /**
   * @param {Point2D} point 
   * @param {number} value 
   * @returns {GeoConstraint2D}
   */
  static constFixedY(point, value) {
    return {
      type: "fixed y",
      points: [point],
      constraintEqs: [() => point.y - value],
      constraintGrad: [[() => 0, () => 1]]
    }
  }

  /**
   * @param {Point2D} point0
   * @param {Point2D} point1
   * @returns {GeoConstraint2D}
   */
  static constVert(point0, point1) {
    return {
      type: "vert",
      points: [point0, point1],
      constraintEqs: [() => point0.x - point1.x],
      constraintGrad: [
        [() =>  1, () => 0],
        [() => -1, () => 0]
      ]
    }
  }
  
  /**
   * @param {Point2D} point0
   * @param {Point2D} point1
   * @returns {GeoConstraint2D}
   */
  static constHorz(point0, point1) {
    return {
      type: "horz",
      points: [point0, point1],
      constraintEqs: [() => point0.y - point1.y],
      constraintGrad: [
        [() => 0, () =>  1],
        [() => 0, () => -1]
      ]
    }
  }

  /**
   * @param {Point2D} p0
   * @param {Point2D} p1
   * @param {number} value distance between p0 and p1
   * @returns {GeoConstraint2D}
   */
  static constDist(p0, p1, value) {
    return {
      type: "dist",
      points: [p0, p1],
      constraintEqs: [() => {
        let dx = p1.x - p0.x;
        let dy = p1.y - p0.y;
        return dx*dx + dy*dy - value*value;
      }],
      constraintGrad: [
        [() => p0.x - p1.x, () => p0.y - p1.y],
        [() => p1.x - p0.x, () => p1.y - p0.y]
      ]
    }
  }
  
  /**
   * @param {Point2D} p0
   * @param {Point2D} p1
   * @param {Point2D} p2
   * @returns {GeoConstraint2D}
   */
  static constColinear(p0, p1, p2) {
    return {
      type: "colinear",
      points: [p0, p1, p2],
      constraintEqs: [() => {
        let ABx = p1.x - p0.x;
        let ABy = p1.y - p0.y;
        let ACx = p2.x - p0.x;
        let ACy = p2.y - p0.y;
        return ABx * ACy - ABy * ACx;
      }],
      constraintGrad: [
        [() => p1.y - p2.y, () => p2.x - p1.x],
        [() => p2.y - p0.y, () => p0.x - p2.x],
        [() => p0.y - p1.y, () => p1.x - p0.x]
      ]
    }
  }
}



