import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import './style.css';
const ffmpeg = createFFmpeg({
	corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',
	log: true,
});

ffmpeg.setLogger(({ type, message }) => {
	const videoDiv = document.getElementById('videoView');
	const loadDiv = document.getElementById('loadDiv');
	const preveiwVideo = document.getElementById('preveiwVideo');
	console.log(message);
	if (
		[
			'run ffmpeg command: -framerate 1 -loop 1 -i img1.jpg -i srcMp3.mp3 -s 1280x720 -c:a aac -c:v libx264 -shortest -pix_fmt yuv420p output.mp4',
			'load ffmpeg-core',
		].includes(message)
	) {
		if (videoDiv.classList.contains('hidden')) {
			videoDiv.classList.toggle('hidden');
		}
		if (loadDiv.classList.contains('hidden')) {
			loadDiv.classList.toggle('hidden');
		}
		if (!preveiwVideo.classList.contains('hidden')) {
			preveiwVideo.classList.toggle('hidden');
		}
		setTimeout(() => {
			window.scrollTo({
				top: document.body.scrollHeight,
				behavior: 'smooth',
			});
		}, 250);
	}
	if (message == 'FFMPEG_END') {
		if (!loadDiv.classList.contains('hidden')) {
			loadDiv.classList.toggle('hidden');
		}
		if (preveiwVideo.classList.contains('hidden')) {
			preveiwVideo.classList.toggle('hidden');
		}
	}
});
const thumbnailFile = document.getElementById('thumbnailInput');
const applyButton = document.getElementById('applyText');
const removeButton = document.getElementById('removeText');
const nav = document.getElementById('controlDiv');
const navButton = document.getElementById('showControl');
const convertButton = document.getElementById('convertButton');
const resButton = document.getElementById('resSelect');

resButton.addEventListener('click', initCanvas);

function getRes() {
	const resValue = document.getElementById('resSelect').value;
	const [x, y] = resValue.replace(/\s/gi, '').split('x');
	return [x, y];
}

function initCanvas() {
	const canvas = document.getElementById('myCanvas');
	const ctx = canvas.getContext('2d');
	ctx.fillStyle = 'black';
	const [x, y] = getRes();
	canvas.width = x;
	canvas.height = y;
	ctx.clearRect(0, 0, x, y);
	ctx.fillRect(0, 0, x, y);
	return [x, y];
}

window.onload = function () {
	initCanvas();
};

function setThumbnailContent(files) {
	if (files) {
		const src = URL.createObjectURL(files);
		const canvas = document.getElementById('myCanvas');
		const ctx = canvas.getContext('2d');
		const [x, y] = initCanvas();
		const img = new Image();
		img.src = src;
		img.onload = function () {
			let whr = img.width / img.height;
			let nx = x;
			let ny = nx / whr;
			if (ny > y) {
				ny = y;
				nx = ny * whr;
			}
			let xOffset = nx < x ? (x - nx) / 2 : 0;
			let yOffset = ny < y ? (y - ny) / 2 : 0;
			ctx.drawImage(img, xOffset, yOffset, nx, ny);
		};
	}
}
async function convertMP4() {
	const mp3File = document.getElementById('mp3Value').files[0];
	if (!mp3File) {
		alert('MP3 파일을 넣어주세요!');
		return;
	}
	const video = document.getElementById('preveiwVideo');
	const reader = new FileReader();
	const [x, y] = getRes();
	reader.readAsArrayBuffer(mp3File);
	reader.onloadend = async (e) => {
		if (e.target.readyState === FileReader.DONE) {
			const canvas = document.getElementById('myCanvas');
			const b64Image = dataURItoUINT8(canvas.toDataURL());
			const arrayBuffer = e.target.result;
			let array = new Uint8Array(arrayBuffer);
			if (!ffmpeg.isLoaded()) {
				await ffmpeg.load();
			}
			ffmpeg.FS('writeFile', 'img1.jpg', b64Image);
			ffmpeg.FS('writeFile', 'srcMp3.mp3', array);
			await ffmpeg.run(
				'-loop',
				'1',
				'-framerate',
				'1',
				'-i',
				'img1.jpg',
				'-i',
				'srcMp3.mp3',
				'-c:a',
				'copy',
				'-s',
				`${x}x${y}`,
				'-c:v',
				'libx264',
				'-shortest',
				'-crf',
				'0',
				'-pix_fmt',
				'yuv420p',
				'output.mp4'
			);
			const data = ffmpeg.FS('readFile', 'output.mp4');
			const filesrc = URL.createObjectURL(
				new Blob([data.buffer], { type: 'video/mp4' })
			);
			video.src = filesrc;
		}
	};
}
function dataURItoUINT8(dataURI) {
	// convert base64/URLEncoded data component to raw binary data held in a string
	var byteString;
	if (dataURI.split(',')[0].indexOf('base64') >= 0)
		byteString = atob(dataURI.split(',')[1]);
	else byteString = unescape(dataURI.split(',')[1]);

	// separate out the mime component
	var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

	// write the bytes of the string to a typed array
	var ia = new Uint8Array(byteString.length);
	for (var i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}

	return ia;
}
function setTextContent() {
	const fontConvert = {
		배민한나Air: 'bm-hanna-air',
		배민한나Pro: 'bm-hanna-pro',
		배민을지로: 'bm-euljiro',
		스포카네오산스: 'Spoqa Han Sans Neo',
	};

	const titleText = document.getElementById('titleText').value;
	const titleColor = document.getElementById('titleColor').value;
	const titleSize = document.getElementById('titleSize').value;
	const titleX = document.getElementById('titleX').valueAsNumber;
	const titleY = document.getElementById('titleY').valueAsNumber;

	const subtitleText = document.getElementById('subtitleText').value;
	const subtitleColor = document.getElementById('subtitleColor').value;
	const subtitleSize = document.getElementById('subtitleSize').value;
	const subtitleX = document.getElementById('subtitleX').valueAsNumber;
	const subtitleY = document.getElementById('subtitleY').valueAsNumber;
	const fontValue = document.getElementById('fontSelect').value;
	const [x, y] = getRes();

	const canvas = document.getElementById('myCanvas');
	const ctx = canvas.getContext('2d');
	const font =
		fontConvert[fontValue] !== undefined
			? fontConvert[fontValue]
			: 'Spoqa Han Sans Neo';
	ctx.textAlign = 'center';
	ctx.font = `${titleSize}px ${font}`;
	ctx.fillStyle = titleColor;
	ctx.fillText(titleText, x / 2 + titleX, y / 2 + titleY);

	ctx.textAlign = 'center';
	ctx.font = `${subtitleSize}px ${font}`;
	ctx.fillStyle = subtitleColor;
	ctx.fillText(subtitleText, x / 2 + subtitleX, y / 1.5 + subtitleY);
}

function removeText() {
	initCanvas();
	const thumbnailFile = document.getElementById('thumbnailInput').files[0];
	if (thumbnailFile) {
		setThumbnailContent(thumbnailFile);
	}
}

function menuToggle() {
	if (nav.classList.contains('show')) {
		nav.style.transform = 'translateX(0)';
	} else {
		nav.style.transform = 'translateX(15rem)';
	}

	nav.classList.toggle('show');
}

navButton.addEventListener('click', menuToggle);
thumbnailFile.addEventListener('change', (e) =>
	setThumbnailContent(e.target.files[0])
);
applyButton.addEventListener('click', setTextContent);
removeButton.addEventListener('click', removeText);
convertButton.addEventListener('click', convertMP4);
