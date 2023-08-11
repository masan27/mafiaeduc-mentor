import SectionWrapper from '@/components/wrappers/SectionWrapper';
import { getUser } from '@/stores/reducers/authSlice';
import { Button, Input, Spinner } from '@material-tailwind/react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { BiSolidCloudUpload } from 'react-icons/bi';
import useUpdateProfile from '@/hooks/apis/useUpdateProfile';
import { toast } from 'react-toastify';
import useChangePhoto from '@/hooks/apis/useChangePhoto';
import { useQueryClient } from '@tanstack/react-query';

export default function ProfileSection() {
    const user = useSelector(getUser);

    const [previewImage, setPreviewImage] = useState(null);

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        linkedin: '',
        photo: '',
    });

    const handleOnChange = (e) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value,
        });
    };

    useEffect(() => {
        if (user) {
            setForm({
                fullName: user.full_name,
                email: user.email,
                phone: user.phone,
                photo: user.photo,
                linkedin: user.linkedin,
            });

            setPreviewImage(user.photo);
        }
    }, [user]);

    const photoRef = useRef(null);

    const handleSelectImage = (e) => {
        const { files } = e.target;

        if (files) {
            setPreviewImage(URL.createObjectURL(files[0]));

            setForm({
                ...form,
                photo: files[0],
            });
        }
    };

    const queryClient = useQueryClient();

    const handleOnSuccess = (res) => {
        toast.success(res.message);
        queryClient.invalidateQueries('user');
    };

    const handleOnError = (err) => {
        toast.error(err.message);
    };

    const { mutate: updateProfile, isLoading: isUpdateProfileLoading } =
        useUpdateProfile({
            onSuccess: handleOnSuccess,
            onError: handleOnError,
        });

    const { mutate: changePhoto, isLoading: isChangePhotoLoading } =
        useChangePhoto({
            onSuccess: handleOnSuccess,
            onError: handleOnError,
        });

    const handleUpdateProfile = (e) => {
        e.preventDefault();

        const payloadProfile = {
            full_name: form.fullName,
            email: form.email,
            phone: form.phone,
            linkedin: form.linkedin,
        };

        updateProfile({ data: payloadProfile });

        if (form.photo !== user?.photo) {
            const payloadPhoto = new FormData();
            payloadPhoto.append('picture', form.photo);

            changePhoto({ data: payloadPhoto });
        }
    };

    return (
        <SectionWrapper
            title='Profile'
            subTitle='Menu ini digunakan untuk mengelola profile'
            className='pt-4 space-y-4'
        >
            <div className='flex-col gap-6 flexCenter'>
                <div className='overflow-hidden rounded-full h-44 w-44'>
                    <img
                        className='object-cover object-center w-full h-full'
                        src={previewImage ? previewImage : form?.photo}
                        alt={form?.fullName}
                    />
                </div>

                <input
                    type='file'
                    hidden
                    ref={photoRef}
                    onChange={handleSelectImage}
                />
                <Button
                    color='blue'
                    variant='text'
                    className='flex items-center gap-3'
                    onClick={() => photoRef.current.click()}
                >
                    <BiSolidCloudUpload size={22} />
                    Upload Foto
                </Button>
            </div>

            <form onSubmit={handleUpdateProfile} className='py-4'>
                <main className='flex flex-col gap-6 mb-4'>
                    <Input
                        size='lg'
                        name='fullName'
                        label='Nama Lengkap'
                        variant='outlined'
                        value={form?.fullName}
                        onChange={handleOnChange}
                        required
                    />
                    <Input
                        size='lg'
                        name='email'
                        type='email'
                        label='Email'
                        variant='outlined'
                        value={form?.email}
                        onChange={handleOnChange}
                        required
                    />
                    <Input
                        size='lg'
                        name='phone'
                        label='Nomor Telepon'
                        variant='outlined'
                        value={form?.phone}
                        onChange={handleOnChange}
                        required
                    />
                    <Input
                        size='lg'
                        name='linkedin'
                        label='Link Linkedin'
                        variant='outlined'
                        value={form?.linkedin}
                        onChange={handleOnChange}
                    />
                </main>

                <footer className='flex justify-end mt-6'>
                    <Button
                        type='submit'
                        color='blue'
                        variant='filled'
                        size='lg'
                        disabled={
                            isChangePhotoLoading || isUpdateProfileLoading
                        }
                    >
                        {isChangePhotoLoading || isUpdateProfileLoading ? (
                            <Spinner color='white' />
                        ) : (
                            'Simpan'
                        )}
                    </Button>
                </footer>
            </form>
        </SectionWrapper>
    );
}
