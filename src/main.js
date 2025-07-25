import {
  createStatsLog,
  getData,
  getStats,
  updateStats,
} from "./essentials/BackendMethods/Php/fetchMethods";
import { getLevel, init } from "./scenes/index";
import { getMinutes, secondsToTime, timeToMilliseconds } from "./tools/parseTime";

let score = Number(0);
let blocksCollected = Number(1);
let falls = Number(0);
let totalTimePlayed = Number(0);
let levels_completed = Number(0);
let timePlayed = Number(0);

let terrainPhp = [];
let buildsAdminPhp = [];
let tree_trunk = [];
let tree_leaves = [];
let newBlocksArray = [];
let collectables = [];

document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("token")) {
    window.location.href = "./index.html";
  } else {
    getData().then((terrain) => {
      try {
        terrainPhp = JSON.parse(terrain.terrain_base);
        buildsAdminPhp = JSON.parse(terrain.build_admin);
        tree_trunk = JSON.parse(terrain.tree_trunk);
        tree_leaves = JSON.parse(terrain.tree_leaves);
      } catch (error) {
        console.error("Error to parse el string a array:", error);
      }
      getStats({ token: localStorage.getItem("token") })
        .then((stats) => {
          try {
            console.log(stats);
            console.log(localStorage.getItem("token"));
            score = stats.score | 0;
            totalTimePlayed = timeToMilliseconds(stats.time_played) | 0;
            blocksCollected = stats.blocks_collected | 0;
            falls = stats.falls | 0;
            levels_completed = stats.levels_completed | 0;
            console.log(score, blocksCollected, falls, levels_completed) | 0;
            newBlocksArray = stats.builds_user
              ? JSON.parse(stats.builds_user)
              : [];
            collectables = stats.collectables
              ? JSON.parse(stats.collectables)
              : [false, false, false, false, false, false, false];
              timePlayed = Date.now();
          } catch (error) {
            console.error("Error to string a array:", error);
            newBlocksArray = [];
            collectables = [false, false, false, false, false, false, false];
          }
        })
        .then(() => {
          init(
            terrainPhp,
            buildsAdminPhp,
            tree_trunk,
            tree_leaves,
            newBlocksArray,
            collectables
          );
        });
    });
  }
});

export async function saveData() {
  await updateStats({
    score: getScore(),
    time_played: secondsToTime(
      (Date.now() + totalTimePlayed - timePlayed) / 1000
    ),
    blocks_collected: blocksCollected,
    falls: falls,
    token: localStorage.getItem("token"),
    levels_completed: levels_completed,
    builds_user: JSON.stringify(newBlocksArray),
    collectables: JSON.stringify(collectables),
  });
}

export function increasefalls() {
  falls++;
}

export function levelsCompleted() {
  levels_completed++;
}

function getScore() {
  return (
    getMinutes((Date.now() + totalTimePlayed - timePlayed) / 1000) * 1 + score
  );
}

export function setScore(points) {
  score += points;
}

export function updateCollectables(
  dirt = [0, false],
  wood = [0, false],
  stone = [0, false],
  snow = [0, false],
  sand = [0, false],
  log = [0, false],
  leaves = [0, false]
) {
  if (dirt[0]) {
    collectables[0] = dirt[1];
    blocksCollected++;
  }
  if (wood[0]) {
    collectables[1] = wood[1];
    blocksCollected++;
  }
  if (stone[0]) {
    collectables[2] = stone[1];
    blocksCollected++;
  }
  if (snow[0]) {
    collectables[3] = snow[1];
    blocksCollected++;
  }
  if (sand[0]) {
    collectables[4] = sand[1];
    blocksCollected++;
  }
  if (log[0]) {
    collectables[5] = log[1];
    blocksCollected++;
  }
  if (leaves[0]) {
    collectables[6] = leaves[1];
    blocksCollected++;
  }
}

export function getCollectables() {
  return collectables;
}

export async function createLog(state) {
  createStatsLog({
    length: (Date.now() - timePlayed) / 1000,
    browser: navigator.userAgent,
    screen: screen.width + "x" + screen.height,
    level: getLevel(),
    has_closed_browser: state,
  });
}
