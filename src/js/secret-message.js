import { hasSignature, readMessage, writeMessage } from './encoding.js';

const fileInput = document.querySelector('input[type="file"]');
const textarea = document.querySelector('textarea');
const canvas = document.createElement('canvas');
const downloadButton = document.querySelector('#download');

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

downloadButton.addEventListener('click', downloadImage);

function downloadImage() {
	canvas.toBlob(blob => {
		const url = URL.createObjectURL(blob, { type: 'image/png' });

		const a = document.createElement('a');
		a.href = url;
		a.download = 'secret.png';
		a.style.display = 'none';
        document.body.appendChild(a);
        
        a.click();
        
		a.remove();
		URL.revokeObjectURL(url);
	}, 'image/png');
}

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

	if (hasSignature(data)) {
		const message = readMessage(data);
		textarea.value = message;
	}
}

function addSecretMessage(text) {
	ctx.drawImage(img, 0, 0, img.width, img.height);

	const imageData = ctx.getImageData(0, 0, img.width, img.height);
	const data = imageData.data;

	writeMessage(data, text);

	ctx.putImageData(imageData, 0, 0);

	getSecretMessageFromCanvas();
}
