const waterCanvas = document.getElementById('waterCanvas');
waterCanvas.width = 200;
waterCanvas.height = 200;

const waterCtx = waterCanvas.getContext('2d');

const waterSimulation = new WaterSimulation(0, 0, waterCanvas.width, waterCanvas.height, 6);

console.log('waterSimulation', waterSimulation);

let mouseDown = false;
let updated = false;
waterCanvas.addEventListener('mousedown', (e) => {
  mouseDown = true;
});

waterCanvas.addEventListener('mouseup', (e) => {
  mouseDown = false;
  updated = false;
  console.log('vel', { x: waterSimulation.velocityX, y: waterSimulation.velocityY });
});
let lastX;
let lastY;

waterCanvas.addEventListener('mousemove', (e) => {
  if (mouseDown && false) {
    var cRect = waterCanvas.getBoundingClientRect();  // Gets CSS pos, and width/height
    var canvasX = Math.round(e.clientX - cRect.left);  // Subtract the 'left' of the canvas 
    var canvasY = Math.round(e.clientY - cRect.top);
    
    const newDensity = waterSimulation.addDensity(canvasX, canvasY, 100);
    console.log('adding density', { canvasX, canvasY, newDensity });
    if (!lastX) {
      lastX = canvasX;
    }
    if (!lastY) {
      lastY = canvasY;
    }
    waterSimulation.addVelocity(canvasX, canvasY, lastX - canvasX, lastY - canvasY);
    lastX = canvasX;
    lastY = canvasY;
  }
});
animate();

function animate(time) {
  // waterSimulation.update(1, 1);
  if (mouseDown && !updated) {
    waterSimulation.update(.1, .01, .001);
    updated = true;
    // console.log('vel', waterSimulation.density);
  }

  waterSimulation.draw(waterCtx);
  
  //waterSimulation.draw(waterCtx);
  // waterSimulation.update(5, 1);
  // waterSimulation.draw(waterCtx);

  requestAnimationFrame(animate);
}