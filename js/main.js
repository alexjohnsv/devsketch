let x = 0
let y = 0

let groups = [];
let weight = 3;
let color = '#ffffff';

let archived = [];

const TOOLBAR_SIZE = 52;

let tool = 'pencil';

function setup() {
  createCanvas(windowWidth, windowHeight - TOOLBAR_SIZE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight - TOOLBAR_SIZE);
}

function mousePressed() {
  if (mouseButton === LEFT && tool === 'pencil') {
    groups.push([]);
  }
}

function keyTyped() {
  if (key === 'z') {
    let item = groups.pop();
    archived.push(item);
  } else if (key === 'y') {
    let item = archived.pop();
    groups.push(item);
  }
}

function mouseDragged(e) {
  if (mouseButton === LEFT) {
    if (tool === 'pencil') {
      let activeGroup = groups.length - 1;

      groups[activeGroup].push({
        x: mouseX + x,
        y: mouseY + y,
        px: pmouseX + x,
        py: pmouseY + y,
        strokeColor: color,
        strokeJoin: ROUND,
        strokeCap: ROUND,
        weight: weight,
      })
    } else if (tool === 'drag') {
      x = x + (mouseX - pmouseX);
      y = y + (mouseY - pmouseY);
    }
  }

  return false;
}

function draw() {
  clear();
  background(0);
  cursor(tool === 'pencil' ? 'images/pencil.png' : 'images/drag.png', 1, 24);

  strokeWeight(0);
  textSize(16);
  fill(255);
  text(`(${x}, ${y})`, 10, 30);

  for (let group of groups) {
    for (let object of group) {
      strokeCap(object.strokeCap);
      strokeJoin(object.strokeJoin);
      strokeWeight(object.weight);
      stroke(object.strokeColor);
      line(object.x - x, object.y - y, object.px - x, object.py - y);
    }
  }
}

function renderColorPalette() {
  const colors = [
    '#ffffff',
    '#009bd9',
    '#fccf00',
    '#e62310',
    '#44af35',
  ];

  const paletteEl = document.querySelector('.palette');

  while (paletteEl.firstChild) {
    paletteEl.removeChild(paletteEl.firstChild);
  }

  let fragment = new DocumentFragment()

  colors.forEach(function (colorItem) {
    let preprend = false;
    const div = document.createElement('div')
    div.style.backgroundColor = colorItem
    div.classList.add('palette__color');

    if (color === colorItem) {
      div.classList.add('palette__color--active');
      preprend = true;
    }

    div.addEventListener('click', (event) => {
      color = newColor;
      renderColorPalette();
    });

    if (preprend) {
      fragment.prepend(div)
    } else {
      fragment.appendChild(div)
    }
  })

  paletteEl.appendChild(fragment)
}

renderColorPalette();

function renderSizes() {
  const sizesEl = document.querySelector('.sizes');

  while (sizesEl.firstChild) {
    sizesEl.removeChild(sizesEl.firstChild);
  }

  let fragment = new DocumentFragment()

  for (let i = 3; i <= 6; i++) {
    const div = document.createElement('div')
    div.innerHTML = i;
    div.classList.add('sizes__item');
    if (weight === i) {
      div.classList.add('sizes__item--active');
    }
    div.addEventListener('click', (event) => {
      weight = i;
      renderSizes();
    });
    fragment.appendChild(div)
  }

  sizesEl.appendChild(fragment)
}

renderSizes();

document.querySelector('.js-reset').addEventListener('click', (event) => {
  groups = [];
  x = 0;
  y = 0;
});
document.querySelector('.js-save').addEventListener('click', (event) => saveCanvas('coolStuff', 'png'));
document.querySelector('.js-pencil').addEventListener('click', (event) => tool = 'pencil');
document.querySelector('.js-drag').addEventListener('click', (event) => tool = 'drag');
