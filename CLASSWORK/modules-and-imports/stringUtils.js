// stringUtils.js
// Practical 02: Modules and Code Organization
// Demonstrating individual function exports

exports.capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

exports.reverseString = (str) => {
    return str.split('').reverse().join('');
};

exports.countVowels = (str) => {
    const vowels = str.match(/[aeiou]/gi);
    return vowels ? vowels.length : 0;
};
