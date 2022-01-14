import { MusicNoteIcon, PhotographIcon } from '@heroicons/react/solid';
import React from 'react';

const UploadBox = ({
	onClick,
	type,
}: {
	onClick: (e: React.ChangeEvent<HTMLInputElement>) => void;
	type: 'audio' | 'image';
}) => {
	const isAudio = type == 'audio';
	return (
		<div className='flex flex-col items-center'>
			<label className='w-20 h-20 flex  justify-center items-center text-center bg-indigo-500 text-white rounded-2xl cursor-pointer'>
				{isAudio ? (
					<MusicNoteIcon className='h-10 w-10' />
				) : (
					<PhotographIcon className='h-10 w-10' />
				)}
				<input
					type='file'
					accept={isAudio ? 'audio/*' : 'image/*'}
					className='hidden'
					onChange={(e) => onClick(e)}
				/>
			</label>
			<label className='my-1 font-bold'>{isAudio ? 'MP3' : 'Image'}</label>
		</div>
	);
};

export default UploadBox;
