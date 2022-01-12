import React from 'react';

interface SmallInputProps {
	text: string;
	type?: 'text' | 'color' | 'number';
	placeholder?: string;
	defaultValue: string | number;
	state: string;
	onChange: (
		e: React.ChangeEvent<HTMLInputElement>,
		state: string,
		prop: string
	) => void;
}

const SmallInput = ({
	text,
	placeholder,
	type = 'number',
	defaultValue,
	state,
	onChange,
}: SmallInputProps) => {
	return (
		<div className='flex justify-around items-center'>
			<label className='w-12 text-center'>{text}</label>
			<input
				type={type}
				placeholder={placeholder}
				value={defaultValue}
				onChange={(e) => onChange(e, state, text)}
				className='px-2 py-1 w-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200'
			/>
		</div>
	);
};
export default SmallInput;
