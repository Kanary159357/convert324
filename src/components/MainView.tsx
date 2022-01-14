import { AtSymbolIcon, RefreshIcon } from '@heroicons/react/solid';
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
	size: number;
	[key: string]: string | number;
}
export interface InputTextState {
	[key: string]: TextState;

	subtitle: TextState;
	title: TextState;
}
export interface CanvasSizeState {
	x: number;
	y: number;
}

export type FontType =
	| '스포카네오산스'
	| '배민한나Air'
	| '배민한나Pro'
	| '배민을지로';

const MainView = () => {
	const textState = {
		text: '',
		color: '#ffffff',
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
	const [canvasFont, setCanvasFont] = useState<FontType>('스포카네오산스');
	const [imageSrc, setImage] = useState<File>();
	const [audioSrc, setAudio] = useState<File>();
	const [isLoading, setLoading] = useState(false);
	const [showPreview, setShowPreview] = useState(false);
	const [canvasSize, setCanvasSize] = useState<CanvasSizeState>({
		x: 1280,
		y: 720,
	});
	const [inputText, setInputText] = useState<InputTextState>(inputInitialState);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		if (ffmpeg == null) {
			ffmpeg = createFFmpeg({
				log: true,
				corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',
			});
		}
		ffmpeg.setLogger(({ message }) => {
			console.log(message);
		});
		ffmpeg.setProgress(({ ratio }) => {
			if (ratio >= 0 && ratio <= 1) {
				console.log(Number((ratio * 100).toFixed(2)));
				setProgress(Number((ratio * 100).toFixed(2)));
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
		setShowPreview(false);
		reader.onloadend = async (e) => {
			if (e.target && canvasRef.current) {
				if (e.target.readyState === FileReader.DONE) {
					const canvas = canvasRef.current;
					const b64Image = dataURItoUINT8(canvas.toDataURL());
					const arrayBuffer = e.target.result;
					const array = new Uint8Array(arrayBuffer as ArrayBuffer);
					const { x, y } = canvasSize;
					if (ffmpeg) {
						setLoading(true);
						if (!ffmpeg.isLoaded()) {
							await ffmpeg.load();
						}
						setTimeout(() => {
							window.scrollTo({
								top: document.body.scrollHeight,
								behavior: 'smooth',
							});
						}, 250);
						ffmpeg.FS('writeFile', 'img1.jpg', b64Image);
						ffmpeg.FS('writeFile', 'srcMp3.mp3', array);
						await ffmpeg.run(
							'-i',
							'srcMp3.mp3',
							'-loop',
							'1',
							'-framerate',
							'1',
							'-i',
							'img1.jpg',
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
						setLoading(false);
						setVideoSrc(filesrc);
						setShowPreview(true);
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
		initCanvas(canvasSize);
		if (imageSrc) {
			setThumbnailContent();
		}
	}
	function initCanvas(canvasSize: CanvasSizeState) {
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
		const newState = { x: Number(x), y: Number(y) };
		setCanvasSize(newState);
		if (canvasRef.current) {
			const canvas = canvasRef.current;
			const ctx = canvas.getContext('2d');
			if (ctx) {
				initCanvas(newState);
			}
		}
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
		const isNum = parseInt(tVal) === Number(tVal);
		const newState = state.toLowerCase();
		const subState = sub.toLowerCase();
		setInputText((prev) => {
			return {
				...prev,
				[newState]: {
					...inputText[newState],
					[subState]: isNum ? Number(tVal) : tVal,
				},
			};
		});
	}

	function setTextContent() {
		const { subtitle, title } = inputText;
		if (subtitle.size <= 0 || title.size <= 0) {
			alert('Size should be bigger than 0!');
			return;
		}
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
				const { x, y } = canvasSize;
				ctx.font = `${title.size}px ${font}`;
				ctx.fillStyle = title.color;
				ctx.fillText(title.text, x / 2 + title.x, y / 2 + title.y);
				console.log(title, subtitle);
				ctx.font = `${subtitle.size}px ${font}`;
				ctx.fillStyle = subtitle.color;
				ctx.fillText(subtitle.text, x / 2 + subtitle.x, y / 1.5 + subtitle.y);
			}
		}
	}
	useEffect(() => {
		initCanvas(canvasSize);
	}, []);
	return (
		<>
			<div className='container w-screen mx-auto py-12'>
				<div className='flex justify-center items-center w-full'>
					<div id='mainDiv' className='flex flex-col justify-center m-auto '>
						<div className='mb-3 flex items-end'>
							<h2 className='text-4xl font-hanAir font-bold text-gray-700'>
								Thumbnail Preview!!!
							</h2>
						</div>
						<canvas
							ref={canvasRef}
							className='shadow-2xl m-auto'
							width='1280'
							height='720'></canvas>

						{(isLoading || showPreview) && (
							<div id='videoView' className='mt-6 mb-3 flex flex-col h-720px'>
								<h2 className='text-4xl font-hanAir font-bold text-gray-700'>
									Video Preview
								</h2>
								{isLoading && (
									<div
										id='loadDiv'
										className='flex flex-col items-center justify-center h-96'>
										<AtSymbolIcon className='animate-spin -ml-1 mr-3 h-32 w-32 text-gray' />
										<div className='text-8xl py-6'>{progress}</div>
									</div>
								)}
								{showPreview && (
									<video
										id='preveiwVideo'
										src={videoSrc}
										className='w-full'
										controls
									/>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
			<Controller
				inputText={inputText}
				onAudioChange={onAudioChange}
				onImageChange={onImageChange}
				onCanvasSizeChange={onCanvasSizeChange}
				onCanvasFontChange={onCanvasFontChange}
				onTextChange={onTextChange}
				setTextContent={setTextContent}
				removeText={removeText}
				convertMP4={convertMP4}
			/>
		</>
	);
};

export default MainView;
