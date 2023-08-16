import {
    getAllPrivateClassOrderApi,
    getDetailPrivateClassApi,
} from '@/api/privateClassApi';
import { addPrivateClassScheduleApi } from '@/api/scheduleApi';
import MainTable from '@/components/tables/MainTable';
import SectionWrapper from '@/components/wrappers/SectionWrapper';
import { dateFormater } from '@/utils/formaters';
import {
    Button,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader,
    IconButton,
    Input,
    Option,
    Select,
    Spinner,
    Typography,
} from '@material-tailwind/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { BsCalendar2PlusFill } from 'react-icons/bs';
import { MdClose } from 'react-icons/md';
import { toast } from 'react-toastify';
import { PiWarningBold } from 'react-icons/pi';

export default function OrderPage() {
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(10);
    const [search, setSearch] = useState('');

    const { data: orders, isLoading } = useQuery(
        ['orders'],
        () =>
            getAllPrivateClassOrderApi({
                page,
                count,
                search,
            }),
        {
            select: (data) => data.data,
        }
    );

    const canPreviousPage = useMemo(() => {
        return page > 1;
    }, [page]);

    const canNextPage = useMemo(() => {
        return orders?.last_page > page;
    }, [page, orders]);

    const nextPage = () => {
        if (canNextPage) {
            setPage((old) => old + 1);
        }
    };

    const prevPage = () => {
        if (canPreviousPage) {
            setPage((old) => old - 1);
        }
    };

    const rows = useMemo(
        () =>
            orders?.data?.length > 0
                ? orders?.data?.map((item) => ({
                      salesId: item?.id,
                      privateClassId: item?.details[0]?.private_classes_id,
                      studentName: item?.user?.detail?.full_name,
                      studentPhone: item?.user?.detail?.phone,
                      subject: item?.details[0]?.private_classes?.subject?.name,
                      learningMethod:
                          item?.details[0]?.private_classes?.learning_method
                              ?.name,
                      grade: item?.details[0]?.private_classes?.grade?.name,
                      salesDate: dateFormater(item?.sales_date),
                  }))
                : [],
        [orders]
    );

    const columns = [
        {
            header: 'Sales ID',
            accessorKey: 'salesId',
        },
        {
            header: 'Kelas ID',
            accessorKey: 'privateClassId',
        },
        {
            header: 'Nama Pemesan',
            accessorKey: 'studentName',
        },
        {
            header: 'Kontak',
            accessorKey: 'studentPhone',
        },
        {
            header: 'Mata Pelajaran',
            accessorKey: 'subject',
        },
        {
            header: 'Metode Pembelajaran',
            accessorKey: 'learningMethod',
        },
        {
            header: 'Jenjang',
            accessorKey: 'grade',
        },
        {
            header: 'Tanggal Pemesanan',
            accessorKey: 'salesDate',
        },
        {
            header: 'Action',
            accessorKey: 'privateClassId',
            cell: (info) => (
                <span className='flex items-center space-x-4'>
                    <IconButton
                        color='green'
                        onClick={() => handleOpenAddModal(info.getValue())}
                    >
                        <BsCalendar2PlusFill size={18} />
                    </IconButton>
                </span>
            ),
        },
    ];

    const [openAddModal, setOpenAddModal] = useState(false);
    const [selectedPrivateClassId, setSelectedPrivateClassId] = useState('');

    const { data: privateClass, isLoading: isPrivateClassLoading } = useQuery(
        ['privateClassDetail', selectedPrivateClassId, openAddModal],
        () => getDetailPrivateClassApi(selectedPrivateClassId),
        {
            enabled: !!selectedPrivateClassId,
            select: (res) => res?.data,
        }
    );

    const [scheduleForm, setScheduleForm] = useState({
        date: '',
        time: '',
        meetingLink: '',
        meetingPlatform: '',
    });

    const handleScheduleFormChange = (e) => {
        const { name, value } = e.target;

        setScheduleForm({ ...scheduleForm, [name]: value });
    };

    const handleOpenAddModal = (classId) => {
        setOpenAddModal(!openAddModal);
        setSelectedPrivateClassId(classId);
    };
    const toggleOpenAddModal = () => setOpenAddModal(!openAddModal);

    const queryClient = useQueryClient();

    const { mutate: addSchedule, isLoading: isAddScheduleLoading } =
        useMutation(
            (payload) =>
                addPrivateClassScheduleApi({
                    classId: selectedPrivateClassId,
                    data: payload,
                }),
            {
                onSuccess: (data) => {
                    queryClient.invalidateQueries('privateClassSchedule');
                    toast.success(
                        data?.message || 'Berhasil menambahkan jadwal'
                    );
                    toggleOpenAddModal();
                },
                onError: (err) => {
                    toast.error(err?.message || 'Terjadi kesalahan');
                },
            }
        );

    const handleAddSchedule = (e) => {
        e.preventDefault();

        const payload = {
            meeting_link: scheduleForm.meetingLink,
            meeting_platform: scheduleForm.meetingPlatform,
            date: scheduleForm.date,
            time: scheduleForm.time,
        };

        addSchedule(payload);
    };

    return (
        <>
            <SectionWrapper
                title='Daftar Pembelian Kelas'
                subTitle='Table ini menampilkan semua pembelian kelas private'
                wrapperClassName='mt-8'
            >
                <MainTable
                    data={rows}
                    columns={columns}
                    isLoading={isLoading}
                    setPageSize={setCount}
                    nextPageAction={nextPage}
                    prevPageAction={prevPage}
                    canNextPage={canNextPage}
                    canPreviousPage={canPreviousPage}
                    currentPage={page}
                    pageCount={orders?.last_page}
                    setSearch={setSearch}
                />
            </SectionWrapper>

            <Dialog open={openAddModal} handler={toggleOpenAddModal} size='sm'>
                <div className='flex items-center justify-between'>
                    <DialogHeader>Buat Jadwal</DialogHeader>
                    <IconButton
                        color='blue-gray'
                        size='sm'
                        variant='text'
                        onClick={toggleOpenAddModal}
                        className='mr-4'
                    >
                        <MdClose size={20} />
                    </IconButton>
                </div>
                <DialogBody divider>
                    {isPrivateClassLoading ? (
                        <div className='flex items-center justify-center h-32'>
                            <Spinner color='blue' className='w-10 h-10' />
                        </div>
                    ) : !isPrivateClassLoading &&
                      privateClass &&
                      privateClass?.schedules?.length > 0 ? (
                        <div className='flex flex-col items-center justify-center h-40 gap-4'>
                            <PiWarningBold size={50} color='#f44336' />
                            <Typography color='blue-gray' variant={'lead'}>
                                Kelas ini sudah memiliki jadwal
                            </Typography>
                        </div>
                    ) : !isPrivateClassLoading &&
                      privateClass &&
                      privateClass?.schedules?.length === 0 ? (
                        <form
                            onSubmit={handleAddSchedule}
                            id='addScheduleForm'
                            className='grid gap-6'
                        >
                            <Input
                                name='date'
                                label='Tanggal'
                                type='date'
                                value={scheduleForm?.date}
                                onChange={handleScheduleFormChange}
                                required
                            />
                            <Input
                                name='time'
                                label='Jam'
                                type='time'
                                value={scheduleForm?.time}
                                onChange={handleScheduleFormChange}
                                required
                            />

                            {parseInt(privateClass?.learning_method_id) ===
                                1 && (
                                <>
                                    <Select
                                        name='meetingPlatform'
                                        label='Meeting Platform'
                                        value={scheduleForm?.meetingLink}
                                        onChange={(value) =>
                                            setScheduleForm({
                                                ...scheduleForm,
                                                meetingPlatform: value,
                                            })
                                        }
                                    >
                                        <Option value='Zoom'>Zoom</Option>
                                        <Option value='Google Meet'>
                                            Google Meet
                                        </Option>
                                        <Option value='Microsoft Teams'>
                                            Microsoft Teams
                                        </Option>
                                    </Select>
                                    <Input
                                        name='meetingLink'
                                        label='Meeting Link'
                                        value={scheduleForm?.meetingLink}
                                        onChange={handleScheduleFormChange}
                                    />
                                </>
                            )}
                        </form>
                    ) : null}
                </DialogBody>
                <DialogFooter className='space-x-2'>
                    <Button
                        type='button'
                        variant='outlined'
                        color='red'
                        onClick={toggleOpenAddModal}
                    >
                        Tutup
                    </Button>
                    {privateClass?.schedules?.length === 0 ? (
                        <Button
                            variant='gradient'
                            color='green'
                            form='addScheduleForm'
                            type='submit'
                            disabled={isAddScheduleLoading}
                        >
                            {isAddScheduleLoading ? (
                                <Spinner color='white' size={'sm'} />
                            ) : (
                                'Buat'
                            )}
                        </Button>
                    ) : null}
                </DialogFooter>
            </Dialog>
        </>
    );
}
