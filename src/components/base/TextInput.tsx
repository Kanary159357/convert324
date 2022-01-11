import React from 'react';

const TextInput = ({
	state,
	onChange,
}: {
	state: string;
	onChange: (
		e: React.ChangeEvent<HTMLInputElement>,
		state: string,
		prop: string
	) => void;
}) => {
	return (
		<div className='flex flex-col space-y-2 my-6'>
			<label
				htmlFor='default'
				className='text-gray-700 select-none font-medium'>
				{state}
			</label>
			<input
				id='titleText'
				type='text'
				name='titleText'
				onChange={(e) => onChange(e, state, 'text')}
				placeholder='텍스트를 입력해주세요'
				className='px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200'
			/>
		</div>
	);
};
export default TextInput;
