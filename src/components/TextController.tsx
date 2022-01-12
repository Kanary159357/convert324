import React from 'react';
import SmallInput from './base/SmallInput';
import TextInput from './base/TextInput';
import { TextState } from './MainView';
interface TextControllerProps {
	text: string;
	state: TextState;
	onChange: (
		e: React.ChangeEvent<HTMLInputElement>,
		state: string,
		prop: string
	) => void;
}
const TextController = ({ state, text, onChange }: TextControllerProps) => {
	return (
		<>
			<TextInput state={text} onChange={onChange} />

			<div className='grid grid-cols-2 grid-rows-2 gap-y-1 my-6 w-full'>
				<SmallInput
					state={text}
					text='Size'
					placeholder='px'
					defaultValue={state.size}
					onChange={onChange}
				/>
				<SmallInput
					state={text}
					text='Color'
					type='color'
					defaultValue={state.color}
					onChange={onChange}
				/>
				<SmallInput
					state={text}
					text='X'
					placeholder='px'
					defaultValue={state.x}
					onChange={onChange}
				/>
				<SmallInput
					state={text}
					text='Y'
					placeholder='px'
					defaultValue={state.y}
					onChange={onChange}
				/>
			</div>
		</>
	);
};

export default TextController;
