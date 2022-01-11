import { SwitchHorizontalIcon } from '@heroicons/react/solid';

const Header = () => {
	return (
		<header className='font-hanAir text-gray-100 bg-gradient-to-r from-blue-500 to-indigo-600  h-24  flex items-center border border-gray-300 border-b-0 px-24 z-50'>
			<SwitchHorizontalIcon className='h-12 w-12' />
			<span className='text-5xl to-yellow-300 font-extrabold '>CONVERT324</span>
		</header>
	);
};

export default Header;
