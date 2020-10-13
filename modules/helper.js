const asyncForEach = async (array, callback) => {
  for (let i = 0; i < array.length; i++) {
    await callback(array[i], i, array);
  }
};

/**
 * @param num The number to round
 * @param precision The number of decimal places to preserve
 * @source https://stackoverflow.com/questions/5191088/how-to-round-up-a-number-in-javascript#5191133
 */
const roundUp = (num, precision) => {
  precision = Math.pow(10, precision);
  return Math.ceil(num * precision) / precision;
};

module.exports = {
  asyncForEach,
  isLoggedInWithRole,
  roundUp,
};
