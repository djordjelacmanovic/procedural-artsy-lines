class Segment {
  constructor({ x, y }, rotation, generation = 0) {
    this._startX = x;
    this._startY = y;
    this.leftLength = 0;
    this.rightLength = 0;
    this.rotation = rotation;
    this.generation = generation;
  }

  get isDone() {
    return this._isDone;
  }

  get length() {
    return this.leftLength + this.rightLength;
  }

  markAsDone() {
    this._isDone = true;
  }

  draw(p5) {
    let { x: leftX, y: leftY } = this.leftCoords;
    let { x: rightX, y: rightY } = this.rightCoords;
    p5.line(leftX, leftY, rightX, rightY);
  }

  spawnChildren(angleDelta) {
    let midpoint = this.midPoint;
    this.markAsDone();
    return [
      new Segment(
        midpoint,
        this.rotation + Math.PI / 2 - angleDelta,
        this.generation + 1
      ),
      new Segment(
        midpoint,
        this.rotation - Math.PI / 2 + angleDelta,
        this.generation + 1
      )
    ];
  }

  growLeft() {
    if (this.isDone) return;
    this.leftLength += 1;
  }

  growRight() {
    if (this.isDone) return;
    this.rightLength += 1;
  }

  get midPoint() {
    let { x: x1, y: y1 } = this.leftCoords;
    let { x: x2, y: y2 } = this.rightCoords;

    return { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
  }

  get leftCoords() {
    let x = this._startX - Math.cos(this.rotation) * this.leftLength;
    let y = this._startY - Math.sin(this.rotation) * this.leftLength;
    return { x, y };
  }

  get rightCoords() {
    let x = this._startX + Math.cos(this.rotation) * this.rightLength;
    let y = this._startY + Math.sin(this.rotation) * this.rightLength;
    return { x, y };
  }

  containsPoint(x, y) {
    return this._isInLineSegment(this.leftCoords, this.rightCoords, { x, y });
  }

  _isInLineSegment(line1, line2, pnt, lineThickness = 1) {
    var L2 =
      (line2.x - line1.x) * (line2.x - line1.x) +
      (line2.y - line1.y) * (line2.y - line1.y);
    if (L2 == 0) return false;
    var r =
      ((pnt.x - line1.x) * (line2.x - line1.x) +
        (pnt.y - line1.y) * (line2.y - line1.y)) /
      L2;

    //Assume line thickness is circular
    if (r < 0) {
      //Outside line1
      return (
        Math.sqrt(
          (line1.x - pnt.x) * (line1.x - pnt.x) +
            (line1.y - pnt.y) * (line1.y - pnt.y)
        ) <= lineThickness
      );
    } else if (0 <= r && r <= 1) {
      //On the line segment
      var s =
        ((line1.y - pnt.y) * (line2.x - line1.x) -
          (line1.x - pnt.x) * (line2.y - line1.y)) /
        L2;
      return Math.abs(s) * Math.sqrt(L2) <= lineThickness;
    } else {
      //Outside line2
      return (
        Math.sqrt(
          (line2.x - pnt.x) * (line2.x - pnt.x) +
            (line2.y - pnt.y) * (line2.y - pnt.y)
        ) <= lineThickness
      );
    }
  }
}

export default Segment;
