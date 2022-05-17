const people = {
  Name: 'Edward',
  Weight: 80,
};

// eslint-disable-next-line no-restricted-syntax
for (const [key, value] of Object.entries(people)) {
  console.log(key, value);
}

const mynumber = [3, 5, 1, 1, 2];
const result = mynumber.filter(item => item > 2);
console.log(result);

class Circle {}

const promise = Promise.resolve();
