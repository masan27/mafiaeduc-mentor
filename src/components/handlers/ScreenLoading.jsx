import { Spinner, Typography } from '@material-tailwind/react';

export default function ScreenLoading({ text = '', className = '' }) {
    return (
        <main className={`flexCenter flex-col h-screen gap-4 ${className}`}>
            <Spinner color='blue' className='w-10 h-10' />
            <Typography variant={'paragraph'} color={'gray'}>
                {text}
            </Typography>
        </main>
    );
}
