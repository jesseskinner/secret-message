import { textToBinary, binaryToText } from './binary.js';

const fileInput = document.querySelector('input[type="file"]');
const textarea = document.querySelector('textarea');
const canvas = document.createElement('canvas');
const img = new Image();
let ctx;

fileInput.addEventListener('change', event => {
	const {
		files: [file]
	} = event.target;

	const fileReader = new FileReader();

	fileReader.onload = () => {
		img.src = fileReader.result;
		img.onload = () => {
			renderCanvas(img, img.width, img.height);
		};
		img.onerror = error => console.log(`Error loading image`, error);
	};

	fileReader.readAsDataURL(file);
});

textarea.addEventListener('input', () => addSecretMessage(textarea.value));

function renderCanvas(img, width, height) {
	canvas.width = width;
	canvas.height = height;
	document.body.appendChild(canvas);

	ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0, width, height);

    getSecretMessageFromCanvas();
}

function getSecretMessageFromCanvas() {
	const data = ctx.getImageData(0, 0, img.width, img.height).data;

	if (containsSecretMessage(data)) {
		const message = readSecretMessage(data);
		console.log(message);
	}
}

function containsSecretMessage(data) {
	return data[0] === 0 && data[1] === 0 && data[2] === 0;
}

function addSecretMessage(text) {
	ctx.drawImage(img, 0, 0, img.width, img.height);

	const imageData = ctx.getImageData(0, 0, img.width, img.height);
	const data = imageData.data;

	// set first pixel black to identify there is a secret message here
	// TODO: something better
	data[0] = 0;
	data[1] = 0;
	data[2] = 0;

	const binary = textToBinary(text);

	data[4] = text.length;
	// data[5] =
    // data[6] =
    
	for (let i = 0; i < binary.length; i += 3) {
		const index = 8 + i + (i / 3);

		data[index] = binary[i];

		if (i + 1 < binary.length) {
			data[index + 1] = binary[i + 1];
		}

		if (i + 2 < binary.length) {
			data[index + 2] = binary[i + 2];
        }
	}

    ctx.putImageData(imageData, 0, 0);
    
    getSecretMessageFromCanvas();
}

function readSecretMessage(data) {
	const length = data[4] * 8;
	const binary = [];

	for (let i = 0; i < length; i += 3) {
		const index = 8 + i + (i / 3);

		binary[i] = data[index];

		if (i + 1 < length) {
			binary[i + 1] = data[index + 1];
		}

		if (i + 2 < length) {
			binary[i + 2] = data[index + 2];
		}
    }
    
    return binaryToText(binary);
}
