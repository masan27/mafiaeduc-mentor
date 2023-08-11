import {Typography} from "@material-tailwind/react";

// eslint-disable-next-line react/prop-types
const SectionWrapper = ({children, title = '', subTitle = '', className = '', wrapperClassName= ''}) => {
    return (
        <main className={`space-y-6 ${wrapperClassName}`}>
            <section
                className={
                    'w-full bg-white px-8 pb-8 pt-6 border rounded-2xl shadow-lg'
                }
            >
                <header className={'pb-4 border-b'}>
                    <Typography variant={'h5'}>
                        {title ?? 'Judul'}
                    </Typography>
                    <Typography variant={'small'} color={'gray'}>
                        {subTitle ?? 'Deskripsi judul'}
                    </Typography>
                </header>

                <main className={`mt-4 ${className}`}>
                    {children}
                </main>
            </section>
        </main>
    );
};

export default SectionWrapper;