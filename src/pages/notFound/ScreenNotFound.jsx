import { Typography } from '@material-tailwind/react';

export default function ScreenNotFound() {
    return (
        <section className='flex-col h-[calc(100vh-150px)] gap-2 flexCenter'>
            <Typography color='blue-gray' variant='h1' className={'text-8xl'}>
                404
            </Typography>
            <Typography color='gray' variant='paragraph'>
                Sorry, we couldn't find that page.
            </Typography>
        </section>
    );
}
