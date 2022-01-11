import React from 'react';
import SmallInput from './base/SmallInput';
import TextInput from './base/TextInput';
import { TextState } from './MainView';

const TextController = React.forwardRef<
	TextState,
	{
		text: string;
		onChange: (
			e: React.ChangeEvent<HTMLInputElement>,
			state: string,
			prop: string
		) => void;
	}
>(({ text, onChange }, ref) => {
	if (ref) {
		console.log(ref);
	}
	return (
		<>
			<TextInput state={text} onChange={onChange} />

			<div className='grid grid-cols-2 grid-rows-2 gap-y-1 my-6 w-full'>
				<SmallInput
					state={text}
					text='Size'
					placeholder='px'
					defaultValue={'50'}
					onChange={onChange}
				/>
				<SmallInput
					state={text}
					text='Color'
					type='color'
					defaultValue={'#ffffff'}
					onChange={onChange}
				/>
				<SmallInput
					state={text}
					text='X'
					placeholder='px'
					defaultValue={0}
					onChange={onChange}
				/>
				<SmallInput
					state={text}
					text='Y'
					placeholder='px'
					defaultValue={0}
					onChange={onChange}
				/>
			</div>
		</>
	);
});

export default TextController;
