const Button = ({
	text,
	width = 'w-20',
	onClick,
}: {
	text: string;
	width?: string;
	onClick?: () => void;
}) => {
	return (
		<button
			onClick={() => onClick}
			className={`${width} bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 my-6 rounded`}>
			{text}
		</button>
	);
};
export default Button;
