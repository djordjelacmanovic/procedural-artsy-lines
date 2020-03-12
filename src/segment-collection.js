class SegmentCollection {
  constructor(
    {
      maxCoordValue,
      maxSegmentCount,
      angleDelta,
      minLengthToSpawn,
      maxSegmentGeneration
    },
    ...segments
  ) {
    this._segments = segments;

    this._maxCoordValue = maxCoordValue;
    this._maxSegmentCount = maxSegmentCount;
    this._angleDelta = angleDelta;
    this._minLengthToSpawn = minLengthToSpawn;
    this._maxGeneration = maxSegmentGeneration;

    this.currentMaxSegmentLength = 0;
    this.currentMaxSegmentGeneration = 0;
  }

  get count() {
    return this._segments.length;
  }

  grow() {
    let hasUnfinished = false;
    this._segments.forEach(segment => {
      if (segment.isDone) return;
      let growRight = false,
        growLeft = false;
      this.currentMaxSegmentGeneration = Math.max(
        this.currentMaxSegmentGeneration,
        segment.generation
      );
      if (this._canGrowRight(segment)) {
        segment.growRight();
        growRight = true;
      } else if (this._canGrowLeft(segment)) {
        segment.growLeft();
        growLeft = true;
      }

      this.currentMaxSegmentLength = Math.max(
        this.currentMaxSegmentLength,
        segment.length
      );

      if (!growRight && !growLeft) {
        if (
          this.count < this._maxSegmentCount &&
          segment.length >= this._minLengthToSpawn
        ) {
          this._segments.push(...segment.spawnChildren(this._angleDelta));
          hasUnfinished = true;
        } else segment.markAsDone();
      } else {
        hasUnfinished = true;
      }
    });
    return hasUnfinished;
  }

  draw(p5) {
    this._segments.forEach(segment => segment.draw(p5));
  }

  _canGrowRight(segment) {
    if (segment.length < 5) return true;
    let { x, y } = segment.rightCoords;
    if (
      x >= this._maxCoordValue ||
      x <= 0 ||
      y >= this._maxCoordValue ||
      y <= 0
    )
      return false;
    return !this._segments.some(s => s !== segment && s.containsPoint(x, y));
  }

  _canGrowLeft(segment) {
    if (segment.length < 5) return true;
    let { x, y } = segment.leftCoords;
    if (
      x >= this._maxCoordValue ||
      x <= 0 ||
      y >= this._maxCoordValue ||
      y <= 0
    )
      return false;
    return !this._segments.some(s => s !== segment && s.containsPoint(x, y));
  }
}

export default SegmentCollection;
