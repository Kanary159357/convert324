const LabelSelecter = ({
	text,
	options,
	onChange,
}: {
	options: string[];
	text: string;
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => {
	return (
		<label className='block text-left space-y-2' style={{ maxWidth: '400px' }}>
			<label
				htmlFor='default'
				className='text-gray-700 select-none font-medium'>
				{text}
			</label>
			<select
				onChange={onChange}
				id='resSelect'
				className='px-2 py-2 rounded-lg border border-gray-300 text-gray-700 form-select block w-full focus:outline-none focus:ring-2 focus:ring-indigo-200 '>
				{options.map((item, i) => {
					return <option key={i + item}>{item}</option>;
				})}
			</select>
		</label>
	);
};

export default LabelSelecter;
