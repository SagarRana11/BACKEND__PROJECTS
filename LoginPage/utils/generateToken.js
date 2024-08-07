const crypto = require('crypto');
const generateToken = () => {
    // Generate a random 5-digit number
    const min = 10000;
    const max = 99999;
    const randomBytes = crypto.randomBytes(4); // Generate 4 random bytes
    const randomValue = randomBytes.readUInt32BE(0); // Convert bytes to a number
    const token = min + (randomValue % (max - min + 1));
    return token;
}

module.exports = generateToken