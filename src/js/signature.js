import { setLastBits, getLastBits } from './binary.js';

export const startIndex = 12;

const signature = {
	0: [0, 0, 0],
	1: [0, 0, 1],
	2: [0, 1, 0],
	4: [0, 1, 1],
	5: [1, 0, 0],
	6: [1, 0, 1],
	8: [1, 1, 0],
	9: [1, 1, 1],
	10: [0, 0, 0]
};

export function hasSignature(data) {
	for (let index in signature) {
		const goal = signature[index];
		const bits = getLastBits(data[index], 3);

		if (bits[0] !== goal[0] || bits[1] !== goal[1] || bits[2] !== goal[2]) {
			return false;
		}
	}

	return true;
}

export function writeSignature(data) {
	for (let index in signature) {
		data[index] = setLastBits(data[index], signature[index]);
	}
}
