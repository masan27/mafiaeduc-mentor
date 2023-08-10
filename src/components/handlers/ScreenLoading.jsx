import { Spinner } from '@material-tailwind/react';

export default function ScreenLoading() {
    return (
        <main className='flexCenter h-screen'>
            <Spinner color='blue' className='h-10 w-10' />
        </main>
    );
}
