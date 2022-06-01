class WaterSimulation {
  constructor(x, y, width, height, gridSize) {
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
    this.density[this.IX(2, 2)] = 100;
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
    this.velocityX = [];
    this.velocityY = [];
    for (let i = 0; i < this.size; ++i) {
      let x = Math.random() * 2;
      this.velocityX.push(x);
      let y = Math.random() * 2;
      this.velocityY.push(y);
    }  
    
    this.x0 = [...this.density];
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

  set_bnd(b) {
    let i;

    for (i = 1; i < this.gridSize; ++i) {
      this.density[this.IX(0, i)] = b == 1 ? -this.density[this.IX(1, i)] : this.density[this.IX(1, i)];
      this.density[this.IX(this.gridSize - 1, i)] = b == 1 ? -this.density[this.IX(this.gridSize - 2, i)] : this.density[this.IX(this.gridSize - 2, i)];
      this.density[this.IX(i, 0)] = b == 2 ? -this.density[this.IX(i, 1)] : this.density[this.IX(i, 1)];
      this.density[this.IX(i, this.gridSize - 1)] = b == 2 ? -this.density[this.IX(i, this.gridSize - 2)] : this.density[this.IX(i, this.gridSize - 2)];
    }
    this.density[this.IX(0, 0)] = 0.5 * (this.density[this.IX(1, 0)] + this.density[this.IX(0,1)]);

    this.density[this.IX(0, this.gridSize - 1)] = 0.5 * (this.density[this.IX(1, this.gridSize - 1)] + this.density[this.IX(0, this.gridSize - 2)]);

    this.density[this.IX(this.gridSize - 1, 0)] = 0.5 * (this.density[this.IX(this.gridSize - 2, 0)] + this.density[this.IX(this.gridSize - 1, 1)]);

    this.density[this.IX(this.gridSize - 1, this.gridSize - 1)] = 0.5 * (this.density[this.IX(this.gridSize - 2, this.gridSize - 1)] + this.density[this.IX(this.gridSize - 1, this.gridSize - 2)]);
  }

  addDensity(x, y, amount) {
    this.density[this.IX(x,y)] += amount;
    return this.density[this.IX(x, y)];
  }

  addVelocity(x, y, amountX, amountY) {
    this.velocityX[this.IX(x,y)] += amountX;
    this.velocityY[this.IX(x, y)] += amountY;
  }

  update(diff, dt) {
    this.densityUpdate(diff, dt);
  }

  densityUpdate(diff, dt) {
    this.swap(this.x0, this.density);
    this.diffuse(0, diff, dt);
    this.swap(this.x0, this.density);
    this.advect(0, dt);
  }

  swap(a, b) {
    let tmp = [...a];
    a = [...b];
    b = [...tmp];
  }

  advect(b, dt) {
    let i, j, i0, j0, i1, j1;
    let x, y, s0, t0, s1, t1, dt0;

    dt0 = dt * this.gridSize;
    for (i = 1; i <= this.gridSize; ++i) {
      for (j = 1; j <= this.gridSize; ++j) {
        x = i - dt0 * this.velocityX[this.IX(i,j)];
        y = j - dt0 * this.velocityY[this.IX(i,j)];

        if (x < 0.5) {
          x = 0.5;
        }
        if (x > this.gridSize + 0.5) {
          x = this.gridSize + 0.5;
        }
        i0 = Math.floor(x);
        i1 = i0 + 1;
        
        if (y < 0.5) {
          y = 0.5;
        }
        if (y > this.gridSize + 0.5) {
          y = this.gridSize + 0.5;
        }
        j0 = Math.floor(y);
        j1 = j0 + 1;

        s1 = x - i0;
        s0 = 1 - s1;
        t1 = y - j0;
        t0 = 1 - t1;

        this.density[this.IX(i,j)] = s0 * (t0 * this.x0[this.IX(i0, j0)] + t1 * this.x0[this.IX(i0, j1)]) + s1 * (t0 * this.x0[this.IX(i1, j0)] + t1 * this.x0[this.IX(i1, j1)]);
      }
    }
    this.set_bnd(b);
  }

  diffuse(b, diff, dt) {
    let i, j, k;
    let a = dt * diff * (this.gridSize - 2) * (this.gridSize - 2);

    for (k = 0; k < 1; ++k) {
      console.log('k', {a, k});
      for (i = 1; i < this.gridSize; ++i) {
        for (j = 1; j < this.gridSize; ++j) {
          const current = this.x0[this.IX(i, j)];
          const topValue = this.density[this.IX(i, j + 1)];
          const bottomValue = this.density[this.IX(i, j - 1)];
          const leftValue = this.density[this.IX(i - 1, j)];
          const rightValue = this.density[this.IX(i + 1, j)];
          const value = (current + a * (leftValue + rightValue + topValue + bottomValue))/(1 + 4 * a);
          this.density[this.IX(i,j)] = value;
          console.log(`setting ${i}, ${j} to ${value}`, {current, topValue, bottomValue, leftValue, rightValue});
        }
      }
      this.set_bnd(b);
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
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(this.width, i);
      ctx.stroke();
    }
  }

  #drawVerticalLines(ctx) {
    for (let i = this.pixelWidth; i < this.width; i += this.pixelWidth) {
      ctx.strokeStyle = 'black';
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
        const color = `hsl(0, 0%, ${this.density[this.IX(i,j)]}%)`;
        // console.log('color', color);
        // const color = 'blue';
        // ctx.fillStyle = this.density[this.#IX(i,j)];
        ctx.fillStyle = color;
        const x = i * this.pixelWidth;
        const y = j * this.pixelHeight;
        ctx.fillRect(x, y, this.pixelWidth, this.pixelHeight);
        // this.#drawCenterPoint(ctx, x, y, this.pixelWidth, this.pixelHeight);
      }
    }
    //this.#drawHorizontalLines(ctx);
    //this.#drawVerticalLines(ctx);
  }

  #drawCenterPoint(ctx, x, y, width, height) {
    this.#drawCircle(ctx, 1, x + (width / 2), y + (height / 2));
  }

  #drawCircle(ctx, radius, centerX, centerY, color = 'black') {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
  }

  draw(ctx) {
    
    // ctx.fillStyle = `#${randomColor}`;
    // ctx.fillRect(this.x, this.y, this.width, this.height);
    this.#drawGrid(ctx);
  }

}