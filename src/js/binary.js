export function textToBinary(text) {
	const binary = [];

	for (let i = 0; i < text.length; i++) {
		const charCode = text.charCodeAt(i);
		const bits = charCode.toString(2).padStart(8, '0');

		for (let j = 0; j < bits.length; j++) {
			binary.push(+bits[j]);
		}
	}

	return binary;
}

export function binaryToText(binary) {
    const chars = [];

    for (let i = 0; i < binary.length; i += 8) {
        const char = binary.slice(i, i + 8).join('');
        chars[i / 8] = String.fromCharCode(parseInt(char, 2));
    }

    return chars.join('');
}
