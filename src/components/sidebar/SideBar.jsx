import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    List,
    ListItem,
    ListItemPrefix,
    Typography,
} from '@material-tailwind/react';
import { useState } from 'react';
import {
    MdClass,
    MdOutlineKeyboardArrowUp,
    MdPayment,
    MdSpaceDashboard,
} from 'react-icons/md';
import {
    BsFillCalendar2WeekFill,
    BsFillCreditCard2FrontFill,
} from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getOpenSidebar } from '@/stores/reducers/animationSlice';
import { FaUserClock } from 'react-icons/fa';

export default function SideBar() {
    const navigate = useNavigate();
    const isOpen = useSelector(getOpenSidebar);
    const [open, setOpen] = useState(0);

    const handleOpen = (value) => {
        setOpen(open === value ? 0 : value);
    };

    const menus = [
        {
            id: 1,
            title: 'Dashboard',
            icon: <MdSpaceDashboard size={24} />,
            path: '/dashboard',
            subMenus: [],
        },
        {
            id: 2,
            title: 'Order',
            icon: <FaUserClock size={24} />,
            path: '/order',
            subMenus: [],
        },
        {
            id: 3,
            title: 'Private Class',
            icon: <MdClass size={24} />,
            path: '/private-class',
            subMenus: [
                {
                    id: 1,
                    title: 'Semua',
                    icon: <BsFillCalendar2WeekFill size={24} />,
                    path: '/private-class',
                },
                {
                    id: 2,
                    title: 'Buat Kelas',
                    icon: <MdPayment size={24} />,
                    path: '/private-class/create',
                },
            ],
        },
        {
            id: 4,
            title: 'Payment',
            icon: <BsFillCreditCard2FrontFill size={24} />,
            path: '/payments',
            subMenus: [
                {
                    id: 1,
                    title: 'Semua',
                    icon: <BsFillCalendar2WeekFill size={24} />,
                    path: '/payment-method',
                },
                {
                    id: 1,
                    title: 'Tambah Metode',
                    icon: <BsFillCalendar2WeekFill size={24} />,
                    path: '/payment-method/add',
                },
            ],
        },
    ];

    return (
        <aside
            className={`w-80 bg-white text-black border-r h-screen lg:visible lg:relative lg:left-0 ${
                isOpen ? 'block' : 'hidden lg:block'
            }`}
        >
            <header className={'py-5 border-b'}>
                <Typography variant={'h4'} className={'font-bold text-center'}>
                    Mentor Dashboard
                </Typography>
                <Typography variant={'small'} className={'text-center'}>
                    Mafia Education Kenanga
                </Typography>
            </header>

            <main className={'mt-10 px-2'}>
                <List>
                    {menus.map((menu) => {
                        if (menu.subMenus.length > 0) {
                            return (
                                <Accordion
                                    key={menu.id}
                                    open={open === menu.id}
                                    icon={
                                        <MdOutlineKeyboardArrowUp
                                            size={22}
                                            className={`mx-auto transition-transform ${
                                                open === menu.id
                                                    ? 'rotate-180'
                                                    : ''
                                            }`}
                                        />
                                    }
                                >
                                    <ListItem
                                        className='p-0'
                                        selected={open === menu.id}
                                    >
                                        <AccordionHeader
                                            onClick={() => handleOpen(menu.id)}
                                            className='p-3 border-b-0'
                                        >
                                            <ListItemPrefix>
                                                {menu.icon}
                                            </ListItemPrefix>
                                            <Typography
                                                color='blue-gray'
                                                className='mr-auto font-normal'
                                                variant={'small'}
                                            >
                                                {menu.title}
                                            </Typography>
                                        </AccordionHeader>
                                    </ListItem>
                                    <AccordionBody className='py-1'>
                                        <List className='p-0 text-sm bg-gray-50'>
                                            {menu.subMenus.map((subMenu, i) => (
                                                <ListItem
                                                    className={
                                                        'border-b last:border-none'
                                                    }
                                                    key={i}
                                                    onClick={() =>
                                                        navigate(subMenu.path)
                                                    }
                                                >
                                                    {/* <ListItemPrefix>
                                                        {subMenu.icon}
                                                    </ListItemPrefix> */}
                                                    <Typography
                                                        variant={'small'}
                                                    >
                                                        {subMenu.title}
                                                    </Typography>
                                                </ListItem>
                                            ))}
                                        </List>
                                    </AccordionBody>
                                </Accordion>
                            );
                        } else {
                            return (
                                <ListItem
                                    key={menu.id}
                                    onClick={() => navigate(menu.path)}
                                >
                                    <ListItemPrefix>{menu.icon}</ListItemPrefix>
                                    <Typography variant={'small'}>
                                        {menu.title}
                                    </Typography>
                                </ListItem>
                            );
                        }
                    })}
                </List>
            </main>
        </aside>
    );
}
