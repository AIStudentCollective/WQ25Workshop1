const classIndex = require('../public/model/imagenet_class_index.json');

export const IMAGENET_CLASSES = Object.fromEntries(
  Object.entries(classIndex).map(([key, [code, name]]) => [
    key, 
    `${name} (${code})`  // Format: "tench (n01440764)"
  ])
);