import useLogout from '@/hooks/useLogout';
import { getUser, logout } from '@/stores/reducers/authSlice';
import {
    Avatar,
    IconButton,
    Menu,
    MenuHandler,
    MenuItem,
    MenuList,
    Spinner,
    Typography,
} from '@material-tailwind/react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { HiOutlineMenuAlt2 } from 'react-icons/hi';
import { toggleSidebar } from '@/stores/reducers/animationSlice';

export default function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(getUser);

    const handleOnSuccess = (res) => {
        dispatch(logout());
        navigate('/login');
        toast.success(res.message);
    };

    const handleOnError = (err) => {
        toast.error(err.message);
    };

    const { mutate, isLoading } = useLogout({
        onSuccess: handleOnSuccess,
        onError: handleOnError,
    });

    const handleLogout = () => {
        mutate();
    };

    const handleOpenSidebar = () => {
        dispatch(toggleSidebar());
    };

    return (
        <header
            className={
                'w-full bg-white h-24 border-b border-gray-200 flexBetween px-8'
            }
        >
            <IconButton
                variant='outlined'
                color='blue-gray'
                className='block lg:hidden'
                onClick={handleOpenSidebar}
            >
                <HiOutlineMenuAlt2 size={26} />
            </IconButton>

            <div className={'ml-auto'}>
                <Menu placement={'bottom-start'}>
                    <MenuHandler>
                        <div className={'flexCenter gap-3 cursor-pointer'}>
                            <Avatar
                                variant='circular'
                                alt={user?.full_name}
                                src={user?.photo}
                            />
                            <div className={'space-y-1 hidden lg:block'}>
                                <Typography
                                    variant='small'
                                    className='font-semibold'
                                >
                                    {user?.full_name || 'Nama Mentor'}
                                </Typography>

                                <Typography variant='small' className='text-xs'>
                                    Mentor
                                </Typography>
                            </div>
                        </div>
                    </MenuHandler>
                    <MenuList>
                        <MenuItem
                            className='flex items-center gap-2'
                            onClick={() => navigate('/akun-saya')}
                        >
                            <Typography variant='small' className='font-normal'>
                                Akun Saya
                            </Typography>
                        </MenuItem>
                        <hr className='my-2 border-blue-gray-50' />
                        <MenuItem
                            className='flex items-center gap-2 '
                            disabled={!!isLoading}
                            onClick={handleLogout}
                        >
                            {isLoading ? (
                                <Spinner size={'lg'} color={'white'} />
                            ) : (
                                <Typography
                                    variant='small'
                                    className='font-normal'
                                >
                                    Keluar
                                </Typography>
                            )}
                        </MenuItem>
                    </MenuList>
                </Menu>
            </div>
        </header>
    );
}
