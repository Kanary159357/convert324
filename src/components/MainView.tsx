import { RefreshIcon } from '@heroicons/react/solid';
import Controller from './Controller';
import React, { useEffect, useRef, useState } from 'react';
import { createFFmpeg, FFmpeg } from '@ffmpeg/ffmpeg';
import dataURItoUINT8 from '../util/dataURItoUINT8';
let ffmpeg: FFmpeg | null = null;

export interface TextState {
	text: string;
	color: string;
	x: number;
	y: number;
	[key: string]: string | number;
}
export interface InputTextState {
	[key: string]: TextState;

	subtitle: TextState;
	title: TextState;
}

export type FontType =
	| '스포카네오산스'
	| '배민한나Air'
	| '배민한나Pro'
	| '배민을지로';
const MainView = () => {
	const textState = {
		text: '',
		color: '',
		x: 0,
		y: 0,
		size: 50,
	};
	const inputInitialState = {
		subtitle: textState,
		title: textState,
	};
	const [videoSrc, setVideoSrc] = useState('');
	const [progress, setProgress] = useState(0);
	const [message, setMessage] = useState('');
	const [canvasFont, setCanvasFont] = useState<FontType>('스포카네오산스');
	const [imageSrc, setImage] = useState<File>();
	const [audioSrc, setAudio] = useState<File>();
	const [canvasSize, setCanvasSize] = useState({ x: 1280, y: 720 });
	const [inputText, setInputText] = useState<InputTextState>(inputInitialState);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		if (ffmpeg == null) {
			ffmpeg = createFFmpeg({
				log: true,
				corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',
			});
		}
		ffmpeg.setLogger(({ type, message }) => {
			if (type !== 'info') {
				setMessage(message);
			}
		});
		ffmpeg.setProgress(({ ratio }) => {
			if (ratio >= 0 && ratio <= 1) {
				setProgress(ratio * 100);
			}
			if (ratio === 1) {
				setTimeout(() => {
					setProgress(0);
				}, 1000);
			}
		});
	});
	async function convertMP4() {
		const reader = new FileReader();
		reader.readAsArrayBuffer(audioSrc as Blob);
		reader.onloadend = async (e) => {
			if (e.target && canvasRef.current) {
				if (e.target.readyState === FileReader.DONE) {
					const canvas = canvasRef.current;
					const b64Image = dataURItoUINT8(canvas.toDataURL());
					const arrayBuffer = e.target.result;
					const array = new Uint8Array(arrayBuffer as ArrayBuffer);
					const { x, y } = canvasSize;
					if (ffmpeg) {
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
						setVideoSrc(filesrc);
					}
				}
			}
		};
	}
	const onAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		const file = e.target.files?.[0];
		setAudio(file);
	};
	const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		const reader = new FileReader();
		const file = e.target.files?.[0];
		setImage(file);
		reader.onloadend = () => {
			if (canvasRef.current) {
				const canvas = canvasRef.current;
				const ctx = canvas.getContext('2d');
				if (ctx) {
					const src = URL.createObjectURL(file as Blob);
					const img = new Image();
					img.src = src;
					const { x, y } = canvasSize;

					img.onload = function () {
						const whr = img.width / img.height;
						let nx = x;
						let ny = nx / whr;
						if (ny > y) {
							ny = y;
							nx = ny * whr;
						}
						const xOffset = nx < x ? (x - nx) / 2 : 0;
						const yOffset = ny < y ? (y - ny) / 2 : 0;
						ctx.drawImage(img, xOffset, yOffset, nx, ny);
					};
				}
			}
		};
		if (file) {
			reader.readAsDataURL(file);
		}
	};
	function setThumbnailContent() {
		if (canvasRef.current) {
			const canvas = canvasRef.current;
			const ctx = canvas.getContext('2d');
			if (ctx) {
				const src = URL.createObjectURL(imageSrc as Blob);
				const img = new Image();
				img.src = src;
				const { x, y } = canvasSize;

				img.onload = function () {
					const whr = img.width / img.height;
					let nx = x;
					let ny = nx / whr;
					if (ny > y) {
						ny = y;
						nx = ny * whr;
					}
					const xOffset = nx < x ? (x - nx) / 2 : 0;
					const yOffset = ny < y ? (y - ny) / 2 : 0;
					ctx.drawImage(img, xOffset, yOffset, nx, ny);
				};
			}
		}
	}
	function removeText() {
		if (imageSrc) {
			setThumbnailContent();
		}
	}
	function initCanvas() {
		if (canvasRef.current) {
			const canvas = canvasRef.current;
			const ctx = canvas.getContext('2d');
			if (ctx) {
				ctx.fillStyle = 'black';
				const { x, y } = canvasSize;

				canvas.width = x;
				canvas.height = y;
				ctx.clearRect(0, 0, x, y);
				ctx.fillRect(0, 0, x, y);
			}
		}
	}
	function onCanvasSizeChange(e: React.ChangeEvent<HTMLSelectElement>) {
		const resValue = e.target.value;
		const [x, y] = resValue.replace(/\s/gi, '').split('x');
		console.log(x, y);
		setCanvasSize({ x: Number(x), y: Number(y) });
	}
	function onCanvasFontChange(e: React.ChangeEvent<HTMLSelectElement>) {
		const fontValue = e.target.value as FontType;
		console.log(fontValue);
		setCanvasFont(fontValue);
	}
	function onTextChange(
		e: React.ChangeEvent<HTMLInputElement>,
		state: string,
		sub: string
	) {
		const tVal = e.target.value;
		const newState = state.toLowerCase();
		setInputText((value) => {
			return {
				...inputText,
				[newState]: { ...inputText[newState], [sub]: tVal },
			};
		});
	}
	useEffect(() => {
		console.log(inputText);
	}, [inputText]);
	function setTextContent() {
		const fontConvert = {
			배민한나Air: 'bm-hanna-air',
			배민한나Pro: 'bm-hanna-pro',
			배민을지로: 'bm-euljiro',
			스포카네오산스: 'Spoqa Han Sans Neo',
		};
		const font = fontConvert[canvasFont];
		if (canvasRef.current) {
			const canvas = canvasRef.current;
			const ctx = canvas.getContext('2d');
			if (ctx) {
				ctx.textAlign = 'center';
				const { subtitle, title } = inputText;
				const { x, y } = canvasSize;
				ctx.font = `${title.size}px ${font}`;
				ctx.fillStyle = title.color;
				ctx.fillText(title.text, x / 2 + title.x, y / 2 + title.y);

				ctx.font = `${subtitle.size}px ${font}`;
				ctx.fillStyle = subtitle.color;
				ctx.fillText(subtitle.text, x / 2 + subtitle.x, y / 2 + subtitle.y);
			}
		}
	}
	useEffect(() => {
		initCanvas();
	}, []);
	return (
		<>
			<div className='container w-screen mx-auto py-12'>
				<div className='flex justify-center items-center w-full'>
					<div id='mainDiv' className='flex flex-col justify-center m-auto '>
						<div className='mb-3 flex items-end'>
							<h2 className='text-4xl font-hanAir font-bold text-gray-700'>
								Thumbnail Preview
							</h2>
						</div>
						<canvas
							ref={canvasRef}
							className='shadow-2xl m-auto'
							width='1280'
							height='720'></canvas>
						<div
							id='videoView'
							className='mt-6 mb-3 flex flex-col h-720px hidden'>
							<h2 className='text-4xl font-hanAir font-bold text-gray-700'>
								Video Preview
							</h2>
							<div
								id='loadDiv'
								className='flex items-center justify-center h-96'>
								<RefreshIcon className='animate-spin -ml-1 mr-3 h-32 w-32 text-gray' />
							</div>

							<video
								id='preveiwVideo'
								src={videoSrc}
								className='w-full hidden'
								controls
							/>
						</div>
					</div>
				</div>
			</div>
			<Controller
				onAudioChange={onAudioChange}
				onImageChange={onImageChange}
				onCanvasSizeChange={onCanvasSizeChange}
				onCanvasFontChange={onCanvasFontChange}
				onTextChange={onTextChange}
				setTextContent={setTextContent}
			/>
		</>
	);
};

export default MainView;
