class WaterSimulation {
  constructor(x, y, width, height, gridSize) {
    this.maxVelocity = 100;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.gridSize = gridSize + 2;
    this.gridWidth = this.gridSize;
    this.gridHeight = this.gridSize;
    this.pixelWidth = this.width / this.gridWidth;
    this.pixelHeight = this.height / this.gridHeight;
    this.size = (gridSize + 2) * (gridSize + 2);
    this.density = Array(this.size).fill(0);
    /* for (let i = 25; i < 75; ++i) {
      for (let j = 25; j < 75; ++j) {
        this.density[this.IX(i,j)] = 100;
      }
    } */
    this.density[this.IX(2, 3)] = 100;
    this.density[this.IX(3, 3)] = 100;
    this.density[this.IX(3, 5)] = 100;
    this.density[this.IX(2, 5)] = 100;
    this.densityLast = [...this.density];
    /* for (let x = 0; x < this.gridSize; ++x) {
      for (let y = 0; y < this.gridSize; ++y) {
        let eoo = y % 2 === 0 ? 0 : 1
        if (x % 2 === eoo) {
          this.density[this.IX(x, y)] = 0;
        } else if ((x === 2 && y === 2) || x === 0 || y === 0 || x === this.gridSize - 1 || y === this.gridSize - 1){
          this.density[this.IX(x, y)] = 0;
        }
      }      
    } */
    this.velocityX = Array(this.size).fill(25);
    this.velocityY = Array(this.size).fill(25);
    this.velocityX[this.IX(2, 3)] = 100;
    this.velocityY[this.IX(2, 3)] = 100;
    
    this.velocityXLast = [...this.velocityX];
    this.velocityYLast = [...this.velocityY];
    /* for (let i = 0; i < this.size; ++i) {
      this.x0[i] = Math.floor(100 * Math.random());
    } */
    /* for (let i = 0; i < this.gridSize; ++i) {
      for (let j = 0; j < this.gridSize; ++j) {
        if (i > this.gridSize * .25 && i < this.gridSize * .75 && j > this.gridSize * .25 && j < this.gridSize * .75) {
          this.x0[this.IX(i,j)] = 100;
        }
      }
    } */
  }

  set_bnd(b, current, log = false) {
    let i;

    for (i = 1; i < this.gridSize - 1; ++i) {
      // set the left wall the the negative of the 2nd column if b == 1
      const leftValue = b == 1 ? -current[this.IX(1, i)] : current[this.IX(1, i)];
      if (log) {
        console.log('leftValue', leftValue);
      }
      current[this.IX(0, i)] = leftValue;
      // set the right wall to the negative fo the 2nd to last column if b = 1
      current[this.IX(this.gridSize - 1, i)] = b == 1 ? -current[this.IX(this.gridSize - 2, i)] : current[this.IX(this.gridSize - 2, i)];

      // set top wall to negative of 2nd row if b == 2
      current[this.IX(i, 0)] = b == 2 ? -current[this.IX(i, 1)] : current[this.IX(i, 1)];
      // set the bottom wall to negative of 2nd to last row if b == 2
      current[this.IX(i, this.gridSize - 1)] = b == 2 ? -current[this.IX(i, this.gridSize - 2)] : current[this.IX(i, this.gridSize - 2)];
    }
    // top left corner is the average of the two next to it.
    current[this.IX(0, 0)] = 0.5 * (current[this.IX(1, 0)] + current[this.IX(0,1)]);

    // bottom left corner is the average of the two next to it.
    current[this.IX(0, this.gridSize - 1)] = 0.5 * (current[this.IX(1, this.gridSize - 1)] + current[this.IX(0, this.gridSize - 2)]);

    // top right corner is the average of the two next to it
    current[this.IX(this.gridSize - 1, 0)] = 0.5 * (current[this.IX(this.gridSize - 2, 0)] + current[this.IX(this.gridSize - 1, 1)]);

    // bottom right corner is the average of the two next to it
    current[this.IX(this.gridSize - 1, this.gridSize - 1)] = 0.5 * (current[this.IX(this.gridSize - 2, this.gridSize - 1)] + current[this.IX(this.gridSize - 1, this.gridSize - 2)]);
  }

  addDensity(x, y, amount) {
    this.density[this.IX(x,y)] += amount;
    return this.density[this.IX(x, y)];
  }

  addVelocity(x, y, amountX, amountY) {
    this.velocityX[this.IX(x,y)] += amountX;
    this.velocityY[this.IX(x, y)] += amountY;
  }

  update(diff, visc, dt, log = false) {
    if (log) {
      console.log('updating velocity');
    }
    this.velocityUpdate(visc, dt);
    if (log) {
      console.log('updating density');
    }
    // this.densityUpdate(diff, dt);
  }

  densityUpdate(diff, dt, log = false) {
    const tmp = [...this.density];
    if (log) {
      console.log('swapping densities', { curr: [...this.density], last: [...this.densityLast]});
    }
    // this.swapDensity();
    if (log) {
      console.log('diffusing densities', { curr: [...this.density], last: [...this.densityLast]});
    }
    // this.diffuse(0, this.density, this.densityLast, diff, dt);
    if (log) {
      console.log('swapping densities', { curr: [...this.density], last: [...this.densityLast]});
    }    
    //this.swapDensity();
    if (log) {
      console.log('advecting densities', { curr: [...this.density], last: [...this.densityLast]});
    }
    this.advect(0, this.density, this.densityLast, this.velocityX, this.velocityY, dt);
    if (log) {
      console.log('complete', { curr: [...this.density], last: [...this.densityLast]});
    }
    this.densityLast = tmp;
  }

  velocityUpdate(visc, dt, log = false) {
    const tmpX = [...this.velocityX];
    const tmpY = [...this.velocityY];
    if (log) {
      console.log('swapping x velocities');
    }
    // this.swap(this.velocityXLast, this.velocityX);
    if (log) {
      console.log('diffusing x velocities');  
      console.log('prior', { x: [...this.velocityX], last: [...this.velocityXLast]});
    }
    // this.diffuse(1, this.velocityX, this.velocityXLast, visc, dt);    
    if (log) {
      console.log('done', { x: [...this.velocityX], last: [...this.velocityXLast]});
      console.log('swapping y velocities');
    }
    // this.swap(this.velocityYLast, this.velocityY);
    if (log) {
      console.log('diffusing y velocities');
    }
    // this.diffuse(1, this.velocityY, this.velocityYLast, visc, dt);
    if (log) {
      console.log('projecting velocities');
    }
    // this.swapVelocityY();
    // this.swapVelocityX();
    // this.project(this.velocityX, this.velocityY, this.velocityXLast, this.velocityYLast, false);
    if (log) {
      console.log('swapping x velocities');
    }
    // this.swap(this.velocityXLast, this.velocityX);
    if (log) {
      console.log('swapping y velocities');
    }
    
    // this.swap(this.velocityYLast, this.velocityY);
    if (log) {
      console.log('advecting x velocities');
    }
    this.advect(1, this.velocityX, this.velocityXLast, [...this.velocityX], [...this.velocityY], dt);
    if (log) {
      console.log('advecting y velocities');
    }
    this.advect(2, this.velocityY, this.velocityYLast, [...this.velocityX], [...this.velocityY], dt);
    if (log) {
      console.log('projecting velocities');
    }
    // this.project(this.velocityX, this.velocityY, this.velocityXLast, this.velocityYLast);
    if (log) {
      console.log('finished');
    }
    this.velocityXLast = tmpX;
    this.velocityYLast = tmpY;
  }

  swapDensity() {
    let tmp = [...this.density];
    this.density = [...this.densityLast];
    this.densityLast = tmp;
  }

  swapVelocityX() {
    let tmp = [...this.velocityX];
    this.velocityX = [...this.velocityXLast];
    this.velocityXLast = tmp;
  }

  swapVelocityY() {
    let tmp = [...this.velocityY];
    this.velocityY = [...this.velocityYLast];
    this.velocityYLast = tmp;
  }
  swap(a, b) {
    let tmp = a;
    a = b;
    b = tmp;
  }

  advect(b, current ,last, currentVelocityX, currentVelocityY, dt, log = false) {
    let x, y, xFloor, xFract, yFloor, yFract, fractLerp, floorLerp;

    // delta time
    let dt0 = dt * (this.gridSize - 2); // Why multiple by N?

    for (let i = 1; i < this.gridSize -1; ++i) {
      for (let j = 1; j < this.gridSize - 1; ++j) {
        // go backward through velocity field
        x = i - dt0 * currentVelocityX[this.IX(i,j)];
        y = j + dt0 * currentVelocityY[this.IX(i,j)];

        if (log) {
          console.log('x,y', { x, y });
        }

        // update the values to ensure they lie within the grid
        if (x < 0.5) {
          x = 0.5;
        }
        if (x > (this.grid - 2) + 0.5) {
          x = (this.grid - 2) + 0.5;
        }
        if (y < 0.5) {
          y = 0.5;
        }
        if (y > (this.grid - 2) + 0.5) {
          y = (this.grid - 2) + 0.5;
        }

        if (log) {
          console.log('adjusted x,y', { x, y });
        }

        xFloor = Math.floor(x);
        xFract = x - xFloor;

        if (log) {
          console.log('x', { xFloor, xFract });
        }

        yFloor = Math.floor(y);
        yFract = y - yFloor;

        if (log) {
          console.log('y', { yFloor, yFract });
        }

        const bLeft = last[this.IX(xFloor, yFloor)];
        const bRight = last[this.IX(xFloor + 1, yFloor)];
        
        floorLerp = this.lerp(bLeft, bRight, xFract);
        if (log) {
          console.log('b', { bLeft, bRight, floorLerp });
        }

        fractLerp = this.lerp(last[this.IX(xFloor, yFloor + 1)], last[this.IX(xFloor + 1, yFloor + 1)], xFract);

        if (log) {
          console.log('lerps', { floorLerp, fractLerp });
        }

        const newValue = this.lerp(floorLerp, fractLerp, yFract);
        if (log) {
          console.log('newValue', newValue);
        }
        current[this.IX(i,j)] = newValue;
      }
    }
    this.set_bnd(b, current);
  }

  lerp(a, b, k) {
    return a + k * (b - a);
  }

  advectOld(b, current, last, currentVelocityX, currentVelocityY, dt, log = false) {
    let i, j, i0, j0, i1, j1;
    let x, y, s0, t0, s1, t1, dt0;

    dt0 = dt * (this.gridSize - 2);
    if (log) {
      console.log('dt0', dt0);
    }
    for (i = 3; i < this.gridSize - 1; i += 10) {
      for (j = 2; j < this.gridSize - 1; j += 10) {
        x = i - dt0 * currentVelocityX[this.IX(i,j)];
        y = j - dt0 * currentVelocityY[this.IX(i,j)];
        if (log) {
          console.log('xy', {x, y});
        }

        if (x < 0.5) {
          if (log) {
            console.log('setting x .5');
          }
          x = 0.5;
        }
        if (x > this.gridSize + 0.5) {
          x = this.gridSize + 0.5;
          if (log) {
            console.log(`setting x ${x}`);
          }
        }
        i0 = Math.floor(x);
        i1 = i0 + 1;
        if (log) {
          console.log('i0, i1' , {i0, i1});
        }
        
        if (y < 0.5) {
          if (log) {
            console.log('setting y .5');
          }
          y = 0.5;
        }
        if (y > this.gridSize + 0.5) {
          y = this.gridSize + 0.5;
          console.log(`setting y ${y}`);
        }
        j0 = Math.floor(y);
        j1 = j0 + 1;

        if (log) {
          console.log('j0, j1', {j0, j1});
        }

        s1 = x - i0;
        s0 = 1 - s1;
        t1 = y - j0;
        t0 = 1 - t1;

        if (log) {
          console.log('values', {s1, s0, t1, t0});
        }
        const _part1 = last[this.IX(i0, j0)];
        const part1 = t0 * _part1;
        const _part2 = last[this.IX(i0, j1)];
        const part2 = t1 * _part2;
        const _part3 = last[this.IX(i1, j0)];
        const part3 = t0 * _part3;
        const _part4 = last[this.IX(i1, j1)];
        // console.log(_part4);
        const part4 = t1 * _part4;
        const value = s0 * (part1 + part2) + s1 * (part3 + part4);

        console.log('value', {last, _part1, part1, _part2, part2, _part3, part3, _part4, part4, value});
        // current[this.IX(i,j)] = value;
      }
    }
    // this.set_bnd(b, current);
  }

  project(currentX, currentY, lastX, lastY, log = false) {
    let i, j, k;
    let h;

    h = 1.0/(this.gridSize - 2);
    if (log) {
      console.log('h', h);
    }
    for (i = 1; i < this.gridSize - 1; ++i) {
      for (j = 1; j < this.gridSize - 1; ++j) {
        const rightXValue = currentX[this.IX(i + 1, j)];
        const leftXValue = currentX[this.IX(i - 1, j)];
        const bottomYValue = currentY[this.IX(i, j + 1)];
        const topYValue = currentY[this.IX(i, j - 1)];
        const value = -0.5 * h * (rightXValue - leftXValue + bottomYValue - topYValue);
        if (log) {
          console.log(`setting last y ${i}, ${j} to ${value}`, {rightXValue, leftXValue, bottomYValue, topYValue});
        }
        
        lastY[this.IX(i,j)] = value;
        lastX[this.IX(i,j)] = 0;
      }
    }
    this.set_bnd(0, lastY);
    this.set_bnd(0, lastX);

    for (k = 0; k < 1; ++k) {
      for (i = 1; i < this.gridSize - 1; ++i) {
        for (j = 1; j < this.gridSize - 1; ++j) {
          const centerYValue = lastY[this.IX(i,j)];
          const leftXValue = lastX[this.IX(i - 1, j)];
          const rightXValue = lastX[this.IX(i + 1, j)];
          const topXValue= lastX[this.IX(i, j -1)];
          const bottomXValue =lastX[this.IX(i, j + 1)];
          const value = (centerYValue + leftXValue + rightXValue + topXValue + bottomXValue) / 4;
          if (log) {
            console.log(`setting last x ${i}, ${j} to ${value}`, {centerYValue, leftXValue, rightXValue, topXValue, bottomXValue});
          }
          lastX[this.IX(i,j)] = value
        }
      }
      this.set_bnd(0, lastX);
    }

    for (i = 1; i < this.gridSize - 1; ++i) {
      for (j = 1; j < this.gridSize - 1; ++j) {
        const rightXValue = lastX[this.IX(i + 1, j)];
        const leftXValue = lastX[this.IX(i - 1, j)];
        const xValue = 0.5 * (rightXValue - leftXValue)/h;
        if (log) {
          console.log(`setting current x ${i}, ${j} to ${xValue}`, {rightXValue, leftXValue});
        }
        currentX[this.IX(i,j)] -= xValue;        

        const bottomYValue = lastY[this.IX(i, j + 1)];
        const topYValue = lastY[this.IX(i, j - 1)];
        const yValue = 0.5 * (bottomYValue - topYValue)/h;
        if (log) {
          console.log(`setting current y ${i}, ${j} to ${yValue}`, {bottomYValue, topYValue});
        }
        currentY[this.IX(i,j)] -= yValue;
      }
    }
    this.set_bnd(1, currentX);
    this.set_bnd(2, currentY);
  }  

  diffuse(b, current, last, diff, dt, log = false) {
    let i, j, k;
    let a = dt * diff * (this.gridSize - 2) * (this.gridSize - 2);

    for (k = 0; k < 1; ++k) {
      if (log) {
        console.log('k', {a, k});
      }
      for (i = 1; i < this.gridSize - 1; ++i) {
        for (j = 1; j < this.gridSize - 1; ++j) {
          const currentValue = last[this.IX(i, j)];
          const topValue = current[this.IX(i, j + 1)];
          const bottomValue = current[this.IX(i, j - 1)];
          const leftValue = current[this.IX(i - 1, j)];
          const rightValue = current[this.IX(i + 1, j)];
          const value = (currentValue + a * (leftValue + rightValue + topValue + bottomValue))/(1 + 4 * a);
          if (log) {
            console.log(`setting ${i}, ${j} to ${value}`, {currentValue, topValue, bottomValue, leftValue, rightValue});
          }
          current[this.IX(i,j)] = value;
        }
      }
      this.set_bnd(b, current, log);
    }
  }

  IX(x, y) {
    return x + this.gridSize * y;
  }

  #getColorArray() {
    const colors = [];
    for (let i = 0; i < this.gridWidth; ++i) {
      const row = [];
      for (let j = 0; j < this.gridHeight; ++j) {
        var randomColor = Math.floor(Math.random()*16777215).toString(16);
        row.push(`#${randomColor}`);
      }
      colors.push(row);
    }
    return colors;
  }

  #drawHorizontalLines(ctx) {
    for (let i = this.pixelHeight; i < this.height; i += this.pixelHeight) {
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(this.width, i);
      ctx.stroke();
    }
  }

  #drawVerticalLines(ctx) {
    for (let i = this.pixelWidth; i < this.width; i += this.pixelWidth) {
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, this.height);
      ctx.stroke();
    }
  }

  #drawGrid(ctx) {
    for (let i = 0; i < this.gridWidth; ++i) {
      for (let j = 0; j < this.gridHeight; ++j) {
        // ctx.fillStyle = this.colors[i][j];
        //console.log('ix', this.#X(i,j));
        if (i === 0 || j === 0 || i === this.gridWidth - 1 || j === this.gridHeight - 1) {
          ctx.fillStyle = 'yellow';
        } else {
          const color = `hsl(0, 0%, ${this.density[this.IX(i,j)]}%)`;
          // console.log('color', color);
          // const color = 'blue';
          // ctx.fillStyle = this.density[this.#IX(i,j)];
          ctx.fillStyle = color;
        }
        
        const x = i * this.pixelWidth;
        const y = j * this.pixelHeight;
        ctx.fillRect(x, y, this.pixelWidth, this.pixelHeight);
        this.#drawCenterPoint(ctx, x, y, this.pixelWidth, this.pixelHeight, i, j, 'blue');
      }
    }
    // this.#drawHorizontalLines(ctx);
    // this.#drawVerticalLines(ctx);
  }

  #drawCenterPoint(ctx, x, y, width, height, i, j, color) {
    const centerX = x + (width / 2);
    const centerY = y + (height / 2);
    this.#drawCircle(ctx, 1, centerX, centerY, color);
    const velocityX = this.velocityX[this.IX(i,j)];
    const velocityY = this.velocityY[this.IX(i,j)];
    const velXPer = velocityX / this.maxVelocity;
    const velYPer = velocityY / this.maxVelocity;
    const xMag = velXPer * (this.pixelWidth / 2);
    const yMag = velYPer * (this.pixelHeight / 2);
    this.#drawArrow(ctx, xMag, yMag, centerX, centerY, 'red');
  }

  #drawCircle(ctx, radius, centerX, centerY, color = 'black') {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
    // this.#drawArrowY(ctx, (this.pixelHeight / 2) - 3, centerX, centerY);
    // this.#drawArrowX(ctx, (this.pixelWidth / 2) - 3, centerX, centerY);
  }

  #drawArrow(ctx, magX, magY, startX, startY, color) {
    const WIDTH = 3;
    ctx.lineWidth = 1;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    const magXAndWidth = magX === 0 ? 0 : magX > 0 ? magX - WIDTH : magX + WIDTH;    
    const magYAndWidth = magY === 0 ? 0 : magY > 0 ? magY - WIDTH : magY + WIDTH;
    const endX = startX + magXAndWidth;
    const endY = startY - magYAndWidth;
    const alpha = Math.atan2(magYAndWidth, magXAndWidth);
    // const alpha = Math.PI / 4;
    const arrowPointY = WIDTH * Math.sin(alpha);
    const arrowPointX = WIDTH * Math.cos(alpha);
    const slope = (endY - startY) / (endX - startX);
    const inverseSlope = -1 / slope;
    const beta = alpha - (Math.PI / 2);
    const arrowSideY = WIDTH * Math.sin(beta);
    const arrowSideX = WIDTH * Math.cos(beta);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.moveTo(endX, endY);
    ctx.lineTo(endX + arrowSideX, endY - arrowSideY);
    ctx.lineTo(endX + arrowPointX, endY - arrowPointY);
    ctx.lineTo(endX - arrowSideX, endY + arrowSideY);
    ctx.fillStyle = color;
    ctx.fill();
    //ctx.moveTo(endX, endY);
    
    //ctx.stroke();
    
    //ctx.stroke();
    /* ctx.lineTo(startX + WIDTH, startY - magnitude);
    ctx.lineTo(startX, startY - magnitude - WIDTH);
    ctx.fillStyle = 'pink';
    ctx.fill();     */
  }

  #drawArrowY(ctx, magnitude, startX, startY) {
    const WIDTH = 3;
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX, startY - magnitude);
    ctx.stroke();
    ctx.moveTo(startX - WIDTH, startY - magnitude);
    ctx.lineTo(startX + WIDTH, startY - magnitude);
    ctx.lineTo(startX, startY - magnitude - WIDTH);
    ctx.fillStyle = 'red';
    ctx.fill();
  }

  #drawArrowX(ctx, magnitude, startX, startY) {
    const WIDTH = 3;
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'green';
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX + magnitude, startY);
    ctx.stroke();
    ctx.moveTo(startX + magnitude, startY - WIDTH);
    ctx.lineTo(startX + magnitude, startY + WIDTH);
    ctx.lineTo(startX + magnitude + WIDTH, startY);
    ctx.fillStyle = 'green';
    ctx.fill();
  }

  draw(ctx) {
    
    // ctx.fillStyle = `#${randomColor}`;
    // ctx.fillRect(this.x, this.y, this.width, this.height);
    this.#drawGrid(ctx);
  }

}