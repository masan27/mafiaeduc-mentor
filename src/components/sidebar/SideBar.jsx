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
import { BsFillCalendar2WeekFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getOpenSidebar } from '@/stores/reducers/animationSlice';

export default function SideBar() {
    const navigate = useNavigate();
    const isOpen = useSelector(getOpenSidebar);
    const [open, setOpen] = useState(0);

    const handleOpen = (value) => {
        setOpen(open === value ? 0 : value);
    };

    return (
        <aside
            className={`w-80 bg-white text-black border-r h-screen lg:visible lg:relative lg:left-0 ${
                isOpen ? 'block' : 'hidden lg:block'
            }`}
        >
            <header className={'py-5'}>
                <Typography variant={'h4'} className={'font-bold text-center'}>
                    Mentor Side
                </Typography>
                <Typography variant={'small'} className={'text-center'}>
                    Mafia Education Apllication
                </Typography>
            </header>

            <main className={'mt-6 px-2'}>
                <List>
                    <ListItem onClick={() => navigate('/')}>
                        <ListItemPrefix>
                            <MdSpaceDashboard size={24} />
                        </ListItemPrefix>
                        Dashboard
                    </ListItem>
                    <Accordion
                        open={open === 1}
                        icon={
                            <MdOutlineKeyboardArrowUp
                                size={22}
                                className={`mx-auto transition-transform ${
                                    open === 1 ? 'rotate-180' : ''
                                }`}
                            />
                        }
                    >
                        <ListItem className='p-0' selected={open === 1}>
                            <AccordionHeader
                                onClick={() => handleOpen(1)}
                                className='border-b-0 p-3'
                            >
                                <ListItemPrefix>
                                    <MdClass size={24} />
                                </ListItemPrefix>
                                <Typography
                                    color='blue-gray'
                                    className='mr-auto font-normal'
                                >
                                    Kelas Private
                                </Typography>
                            </AccordionHeader>
                        </ListItem>
                        <AccordionBody className='py-1'>
                            <List className='p-0 text-sm bg-gray-50'>
                                <ListItem
                                    className={'border-b last:border-none'}
                                    onClick={() => navigate('/kelas-private')}
                                >
                                    {/*<ListItemPrefix>*/}
                                    {/*	<ChevronRightIcon strokeWidth={3} className="h-3 w-5" />*/}
                                    {/*</ListItemPrefix>*/}
                                    Lihat Kelas
                                </ListItem>
                                <ListItem
                                    className={'border-b last:border-none'}
                                    onClick={() =>
                                        navigate('/kelas-private/buat')
                                    }
                                >
                                    {/*<ListItemPrefix>*/}
                                    {/*	<ChevronRightIcon strokeWidth={3} className="h-3 w-5" />*/}
                                    {/*</ListItemPrefix>*/}
                                    Buat Kelas
                                </ListItem>
                            </List>
                        </AccordionBody>
                    </Accordion>
                    <Accordion
                        open={open === 2}
                        icon={
                            <MdOutlineKeyboardArrowUp
                                size={22}
                                className={`mx-auto transition-transform ${
                                    open === 2 ? 'rotate-180' : ''
                                }`}
                            />
                        }
                    >
                        <ListItem className='p-0' selected={open === 2}>
                            <AccordionHeader
                                onClick={() => handleOpen(2)}
                                className='border-b-0 p-3'
                            >
                                <ListItemPrefix>
                                    <BsFillCalendar2WeekFill size={18} />
                                </ListItemPrefix>
                                <Typography
                                    color='blue-gray'
                                    className='mr-auto font-normal'
                                >
                                    Jadwal
                                </Typography>
                            </AccordionHeader>
                        </ListItem>
                        <AccordionBody className='py-1'>
                            <List className='p-0 text-sm bg-gray-50'>
                                <ListItem
                                    className={'border-b last:border-none'}
                                    onClick={() => navigate('/jadwal')}
                                >
                                    {/*<ListItemPrefix>*/}
                                    {/*	<ChevronRightIcon strokeWidth={3} className="h-3 w-5" />*/}
                                    {/*</ListItemPrefix>*/}
                                    Lihat Jadwal
                                </ListItem>
                                <ListItem
                                    className={'border-b last:border-none'}
                                    onClick={() => navigate('/jadwal/buat')}
                                >
                                    {/*<ListItemPrefix>*/}
                                    {/*	<ChevronRightIcon strokeWidth={3} className="h-3 w-5" />*/}
                                    {/*</ListItemPrefix>*/}
                                    Buat Jadwal
                                </ListItem>
                            </List>
                        </AccordionBody>
                    </Accordion>
                    <ListItem onClick={() => navigate('/pembayaran')}>
                        <ListItemPrefix>
                            <MdPayment size={24} />
                        </ListItemPrefix>
                        Pembayaran
                    </ListItem>
                </List>
            </main>
        </aside>
    );
}
