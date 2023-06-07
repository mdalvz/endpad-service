"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLongIdentifier = exports.generateShortIdentifier = exports.generateIdentifier = void 0;
function generateIdentifier(size) {
    const ALPHABET = '0123456789';
    let result = '';
    for (let i = 0; i < size; ++i) {
        result += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    }
    return result;
}
exports.generateIdentifier = generateIdentifier;
function generateShortIdentifier() {
    return generateIdentifier(6);
}
exports.generateShortIdentifier = generateShortIdentifier;
function generateLongIdentifier() {
    return generateIdentifier(32);
}
exports.generateLongIdentifier = generateLongIdentifier;
