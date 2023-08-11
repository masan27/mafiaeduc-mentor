import SectionWrapper from '@/components/wrappers/SectionWrapper';
import useChangePassword from '@/hooks/apis/useChangePassword';
import { Button, Input, Spinner } from '@material-tailwind/react';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function ChangePasswordSection() {
    const [form, setForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleOnSuccess = (res) => {
        toast.success(res?.message);
    };

    const handleOnError = (err) => {
        toast.error(err?.message);
    };

    const { mutate, isLoading } = useChangePassword({
        onSuccess: handleOnSuccess,
        onError: handleOnError,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            old_password: form?.oldPassword,
            new_password: form?.newPassword,
            confirm_new_password: form?.confirmPassword,
        };

        mutate({ data: payload });
    };

    return (
        <SectionWrapper
            title='Change Password'
            subTitle='Menu ini digunakan untuk mengganti password'
            className='pt-4 space-y-4'
        >
            <form onSubmit={handleSubmit} className='py-4'>
                <main className='flex flex-col gap-6 mb-4'>
                    <Input
                        size='lg'
                        name='oldPassword'
                        type='password'
                        label='Password Lama'
                        variant='outlined'
                        value={form?.oldPassword}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        size='lg'
                        name='newPassword'
                        type='password'
                        label='Password Baru'
                        variant='outlined'
                        value={form?.newPassword}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        size='lg'
                        name='confirmPassword'
                        label='Konfirmasi Password'
                        type='password'
                        variant='outlined'
                        value={form?.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </main>

                <footer className='flex justify-end mt-6'>
                    <Button
                        type='submit'
                        color='blue'
                        variant='filled'
                        size='lg'
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Spinner color='white' />
                        ) : (
                            'Ubah Password'
                        )}
                    </Button>
                </footer>
            </form>
        </SectionWrapper>
    );
}
