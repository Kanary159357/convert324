import { ExclamationIcon, SwitchHorizontalIcon } from '@heroicons/react/solid';
import React, { useEffect } from 'react';
import Button from './base/Button';
import LabelSelecter from './base/LabelSelector';

import UploadBox from './base/UploadBox';
import { InputTextState } from './MainView';
import TextController from './TextController';

interface ControllerProp {
	onAudioChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onTextChange: (
		e: React.ChangeEvent<HTMLInputElement>,
		state: string,
		prop: string
	) => void;
	inputText: InputTextState;
	setTextContent: () => void;
	removeText: () => void;
	convertMP4: () => void;
	onCanvasSizeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	onCanvasFontChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Controller = ({
	onAudioChange,
	onImageChange,
	setTextContent,
	removeText,
	onTextChange,
	onCanvasSizeChange,
	onCanvasFontChange,
	convertMP4,
	inputText,
}: ControllerProp) => {
	const FontOptions = [
		'배민한나Air',
		'배민한나Pro',
		'배민을지로',
		'스포카네오산스',
	];
	const ResolutionOption = ['1280 x 720', '1920 x 1080'];
	return (
		<div
			id='controlDiv'
			className=' w-60 h-700px fixed inset-y-40 right-0 transition-all     duration-200 ease-in'>
			<div className='border shadow h-full relative z-20 bg-white rounded-l-2xl '>
				<div
					className='h-10 w-10 absolute inset-y-5 -left-5 z-50 flex items-center justify-center  rounded-full bg-indigo-500'
					id='showControl'>
					<SwitchHorizontalIcon className='h-8 w-8' />
				</div>
				<div className='relative px-5 h-full overflow-y-scroll custom-scrollbar'>
					<div
						id='uploadDiv'
						className='flex h-30 py-6 items-center justify-between'>
						<UploadBox type='audio' onClick={onAudioChange} />
						<UploadBox type='image' onClick={onImageChange} />
					</div>

					<div className='my-6'>
						<LabelSelecter
							onChange={onCanvasFontChange}
							text='Font'
							options={FontOptions}
						/>
					</div>

					<TextController
						state={inputText.title}
						text='Title'
						onChange={onTextChange}
					/>
					<TextController
						state={inputText.subtitle}
						text='SubTitle'
						onChange={onTextChange}
					/>

					<div className='my-6'>
						<LabelSelecter
							onChange={onCanvasSizeChange}
							text='Resolution'
							options={ResolutionOption}
						/>
						<label className='flex text-xs mt-2 text-red-700'>
							<ExclamationIcon className='mr-1 h-6 w-6' />
							<span>Change Resolution cause initialization</span>
						</label>
					</div>
					<div className='flex justify-between'>
						<Button text='Apply' onClick={setTextContent} />
						<Button text='Remove' onClick={removeText} />
					</div>
					<button
						id='convertButton'
						onClick={convertMP4}
						className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-6 rounded'>
						Convert
					</button>
				</div>
			</div>
		</div>
	);
};

export default Controller;
