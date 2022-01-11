const Footer = () => {
	return (
		<>
			<footer
				onClick={(e) => {
					e.preventDefault();
					alert('hi');
				}}
				className='font-hanAir text-gray-100 bg-gradient-to-r from-gray-500 to-gray-900  h-12  flex justify-center items-center border border-gray-300 border-b-0 px-80 z-50'>
				<div className='ml-auto flex'>
					<span className='text-1xl to-yellow-300 font-extrabold px-6'>
						Copyright@2021 by Kanary
					</span>
					<a target='_blank' href='https://github.com/Kanary159357/MP3-TO-MP4'>
						<img src='GitHub-Mark-Light-32px.png' className='w-6 h-6' />
					</a>
				</div>
			</footer>
		</>
	);
};

export default Footer;
