import { IconButton, Typography } from '@material-tailwind/react';
import { useLocation } from 'react-router-dom';

import { TfiReload } from 'react-icons/tfi';

const NotFound = () => {
    const location = useLocation();

    return (
        <section className='flex-col h-screen gap-2 bg-gray-100 flexCenter'>
            <Typography color='blue-gray' variant='h1' className={'text-8xl'}>
                404
            </Typography>
            <Typography color='gray' variant='paragraph'>
                Sorry, we couldn't find that page.
            </Typography>

            <a href={location.pathname}>
                <IconButton
                    variant='text'
                    size='lg'
                    className='mt-2 bg-white border rounded-full shadow-sm'
                    color='black'
                >
                    <TfiReload size={22} />
                </IconButton>
            </a>
        </section>
    );
};

export default NotFound;
