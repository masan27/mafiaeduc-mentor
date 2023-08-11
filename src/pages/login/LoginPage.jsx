import useLogin from '@/hooks/apis/useLogin';
import { login, setToken } from '@/stores/reducers/authSlice';
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Checkbox,
    Input,
    Spinner,
    Typography,
} from '@material-tailwind/react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const clearForm = () => {
        setForm({
            email: '',
            password: '',
        });
    };

    const { mutate, isLoading } = useLogin({
        onSuccess: (data) => {
            const res = data?.data;
            const { token, mentor } = res;
            dispatch(login({ token, user: mentor }));
            dispatch(setToken(token));
            toast.success(data?.message);
            clearForm();

            if (location.state?.from) {
                navigate(location.state.from);
            } else {
                navigate('/dashboard');
            }
        },
        onError: (error) => {
            toast.error(error?.message);
        },
    });

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        mutate(form);
    };

    return (
        <Card className='w-96'>
            <CardHeader
                variant='gradient'
                color='blue'
                className='grid mb-4 h-28 place-items-center'
            >
                <Typography variant='h3' color='white'>
                    Sign In
                </Typography>
            </CardHeader>
            <CardBody>
                <form
                    id='loginForm'
                    onSubmit={handleLoginSubmit}
                    className='flex flex-col gap-6'
                >
                    <Input
                        name='email'
                        type='email'
                        label='Email'
                        size='lg'
                        required
                        autoFocus
                        onChange={handleChange}
                    />
                    <Input
                        name='password'
                        type='password'
                        label='Password'
                        size='lg'
                        required
                        onChange={handleChange}
                    />
                    <div className='-ml-2.5'>
                        <Checkbox label='Remember Me' />
                    </div>
                </form>
            </CardBody>
            <CardFooter className='pt-0'>
                <Button
                    variant='gradient'
                    fullWidth
                    color='blue'
                    type='submit'
                    form='loginForm'
                    disabled={isLoading}
                    className='flex items-center justify-center'
                >
                    {isLoading ? (
                        <Spinner color='white' className='block' />
                    ) : (
                        'Sign In'
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}
