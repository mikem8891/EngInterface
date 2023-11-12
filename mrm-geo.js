// @ts-check

/**
 * @typedef Point2D
 * @prop {number} x
 * @prop {number} y
 */

/**
 * @typedef GeoConstraint2D
 * @prop {string} type constraint type
 * @prop {number[]} indices indices of points the constraint applies to
 * @prop {function(GeometricSystem2D): number[]} constraintEqs equation that is 
 * zero when the constraint is satisfied
 * @prop {function(GeometricSystem2D): number[][]} constraintGrad deritative of
 * the constraint
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
      let constraint = this.constraints[i];
      let constEqs   = constraint.constraintEqs(this);
      let constGrads = constraint.constraintGrad(this);
      if (constEqs.length != constGrads.length)
        throw new Error("amount of constraint equations and gradients do not match");
      for (let j=0; j<constEqs.length; j++) {
        if (constGrads[j].length != 2*constraint.indices.length)
          throw new Error("amount of gradients and points do not match");
        constraintVec.push(constEqs[j]);
        /** @type {number[]} */
        let constGrad = new Array(2*this.points.length);
        for (let k=0; k<constraint.indices.length; k++) {
          let index = constraint.indices[k];
          constGrad[2*index    ] = constGrads[j][2*k    ];
          constGrad[2*index + 1] = constGrads[j][2*k + 1];
        }
        constraintJac.push(constGrad);
        // TODO
      }
    }
  }

  /**
   * @param {number} point index of point the constraint applies to
   * @param {number} value fixed x value of the point
   * @returns {GeoConstraint2D}
   */
  static constFixedX(point, value) {
    /** @type {GeoConstraint2D} */
    let constraint = {
      type: "fixed x",
      indices: [point],
      constraintEqs: (gs) => [gs.points[constraint.indices[0]].x - value],
      constraintGrad: (_) => [[1, 0]]
    }
    return constraint;
  }

  /**
   * @param {number} point index of point the constraint applies to
   * @param {number} value fixed y value of the point
   * @returns {GeoConstraint2D}
   */
  static constFixedY(point, value) {
    /** @type {GeoConstraint2D} */
    let constraint = {
      type: "fixed y",
      indices: [point],
      constraintEqs: (gs) => [gs.points[constraint.indices[0]].y - value],
      constraintGrad: (_) => [[0, 1]]
    }
    return constraint;
  }

  /**
   * @param {number} point0
   * @param {number} point1
   * @returns {GeoConstraint2D}
   */
  static constVert(point0, point1) {
    /** @type {GeoConstraint2D} */
    let constraint = {
      type: "vert",
      indices: [point0, point1],
      constraintEqs: (gs) => {
        let p = gs.points;
        let i = constraint.indices;
        return [p[i[0]].x - p[i[1]].x];
      },
      constraintGrad: (_) => [
        [ 1, 0],
        [-1, 0]
      ]
    }
    return constraint;
  }
  
  /**
   * @param {number} point0
   * @param {number} point1
   * @returns {GeoConstraint2D}
   */
  static constHorz(point0, point1) {
    /** @type {GeoConstraint2D} */
    let constraint = {
      type: "horz",
      indices: [point0, point1],
      constraintEqs: (gs) => {
        let p = gs.points;
        let i = constraint.indices;
        return [p[i[0]].y - p[i[1]].y];
      },
      constraintGrad: (_) => [
        [0,  1],
        [0, -1]
      ]
    }
    return constraint;
  }

  /**
   * @param {number} p0
   * @param {number} p1
   * @param {number} value distance between p0 and p1
   * @returns {GeoConstraint2D}
   */
  static constDist(p0, p1, value) {
    /** @type {GeoConstraint2D} */
    let constraint = {
      type: "dist",
      indices: [p0, p1],
      constraintEqs: (gs) => {
        let p = gs.points;
        let i = constraint.indices;
        let dx = p[i[1]].x - p[i[0]].x;
        let dy = p[i[1]].y - p[i[0]].y;
        return [dx*dx + dy*dy - value*value];
      },
      constraintGrad: (gs) => {
        let p = gs.points;
        let i = constraint.indices;
        let [p0, p1] = [p[i[0]], p[i[1]]];
        return [
          [p0.x - p1.x, p0.y - p1.y],
          [p1.x - p0.x, p1.y - p0.y]
        ]
      }
    }
    return constraint;
  }
  
  /**
   * @param {number} p0
   * @param {number} p1
   * @param {number} p2
   * @returns {GeoConstraint2D}
   */
  static constColinear(p0, p1, p2) {
    /** @type {GeoConstraint2D} */
    let constraint = {
      type: "colinear",
      indices: [p0, p1, p2],
      constraintEqs: (gs) => {
        let p = gs.points;
        let i = constraint.indices;
        let [p0, p1, p2] = [p[i[0]], p[i[1]], p[i[2]]];
        let ABx = p1.x - p0.x;
        let ABy = p1.y - p0.y;
        let ACx = p2.x - p0.x;
        let ACy = p2.y - p0.y;
        return [ABx * ACy - ABy * ACx];
      },
      constraintGrad: (gs) => {
        let p = gs.points;
        let i = constraint.indices;
        let [p0, p1, p2] = [p[i[0]], p[i[1]], p[i[2]]];
        return [
          [p1.y - p2.y, p2.x - p1.x],
          [p2.y - p0.y, p0.x - p2.x],
          [p0.y - p1.y, p1.x - p0.x]
        ];
      }
    }
    return constraint;
  }
}



