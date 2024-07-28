const up = 'ArrowUp';
const right = 'ArrowRight';
const down = 'ArrowDown';
const left = 'ArrowLeft';
const arrowsArray = [up, right, down, left];
const board = document.querySelector('.board');
const tilesWrapper = board.querySelector('.board__tiles');
const tileTemplate = document.querySelector('#tile').content.querySelector('.tile');

// helper
const getRandomNumber = (max, min) => {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
};

// tile value rule
const setDefaultValueRules = () => {
  const chance = getRandomNumber(9, 1);
  if (chance < 9) {
    return 2;
  } else {
    return 4;
  }
};

// tile position
// const setRandomPosition = () => {
//   // const tiles = board.querySelectorAll('li.tile');
//   // let x;
//   // let y;
//   // let isEmpty = false;
//
//   // do {
//   //   x = getRandomNumber(4, 1);
//   //   y = getRandomNumber(4, 1);
//   //   // console.log([...tiles].map(item=> {
//   //   //   // console.log(!item.classList.contains(`tile_position_${x}_${y}`));
//   //   //   return [...item.classList].includes(`tile_position_${x}_${y}`)
//   //   // }));
//   //   // console.log([...tiles].includes(item=> {
//   //   //   // console.log(!item.classList.contains(`tile_position_${x}_${y}`));
//   //   //   return item.classList.contains(`tile_position_${x}_${y}`)
//   //   // }));
//   //   //  x, y, [...tiles],
//   //   //  должен вернуть фолз чтобы значение было уникальным
//   //
//   //   [...tiles].forEach(item => {
//   //     // console.log(item, x, y, [...item.classList].includes(`tile_position_${x}_${y}`));
//   //     if ([...item.classList].includes(`tile_position_${x}_${y}`)) {
//   //       isEmpty = true;
//   //     }
//   //   });
//   // } while (isEmpty);
//
//   return 'coords';
// };


const setTilePosition = (tile) => {
  // setRandomPosition();
  const { x, y } = setRandomPosition();
  const positionClass = `tile_position_${x}_${y}`;
  tile.classList.add(positionClass);
};

const setTileValue = (tile, content, value) => {
  content.textContent = value;
  tile.classList.add(`tile_value_${value}`);
};

const addTile = (tile) => {
  tilesWrapper.appendChild(tile);
};

const createTile = (template, value = 'default') => {
  const tileClone = template.cloneNode(true);
  const tileCloneContent = tileClone.querySelector('.tile__content');
  setTilePosition(tileClone);

  if (value === 'default') {
    const tileCloneDefaultValue = setDefaultValueRules();
    setTileValue(tileClone, tileCloneContent, tileCloneDefaultValue);
  } else {
    setTileValue(tileClone, tileCloneContent, value);
  }
  // console.log(tileClone);

  return tileClone;
};

const moveTiles = (direction) => {
  if (direction) {

  }
};

const mergeTiles = () => {
};

arrowsArray.forEach(item => {
  document.addEventListener('keydown', (e) => {
    if (e.key === item) {
      // console.log(item);
      const tile = createTile(tileTemplate);
      addTile(tile);
    }
  });
});
