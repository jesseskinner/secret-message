import { textToBinary, binaryToText, setLastBit } from './binary.js';
import { writeSignature, startIndex } from './signature.js';

export { hasSignature } from './signature.js';

export function writeMessage(data, text) {
	writeSignature(data);

	const binary = textToBinary(text);

    // TODO: spread the length out across multiple pixels
	data[startIndex] = text.length;

	for (let i = 0; i < binary.length; i += 3) {
		const index = startIndex + 4 + i + i / 3;

        // TODO: if storing large amount of data,
        // we'd have to set more than one bit
		data[index] = setLastBit(data[index], binary[i]);

		if (i + 1 < binary.length) {
			data[index + 1] = setLastBit(data[index + 1], binary[i + 1]);
		}

		if (i + 2 < binary.length) {
			data[index + 2] = setLastBit(data[index + 2], binary[i + 2]);
		}
	}
}

export function readMessage(data) {
	const length = data[startIndex] * 8;
	const binary = [];

	for (let i = 0; i < length; i += 3) {
		const index = startIndex + 4 + i + i / 3;

		binary[i] = data[index] & 1;

		if (i + 1 < length) {
			binary[i + 1] = data[index + 1] & 1;
		}

		if (i + 2 < length) {
			binary[i + 2] = data[index + 2] & 1;
		}
	}

	return binaryToText(binary);
}
