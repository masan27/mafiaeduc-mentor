import {
    getDetailPrivateClassApi,
    updatePrivateClassApi,
} from '@/api/privateClassApi';
import ScreenLoading from '@/components/handlers/ScreenLoading';
import { formatRupiah, parseRupiah } from '@/utils/helpers';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ScreenNotFound from '../notFound/ScreenNotFound';
import SectionWrapper from '@/components/wrappers/SectionWrapper';
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
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { setSubjects } from '@/stores/reducers/subjectSlice';
import { useDispatch } from 'react-redux';
import { setGrades } from '@/stores/reducers/gradeSlice';
import useSubject from '@/hooks/apis/useSubject';
import useGrade from '@/hooks/apis/useGrade';
import { toast } from 'react-toastify';
import MainTable from '@/components/tables/MainTable';
import {
    addPrivateClassScheduleApi,
    deletePrivateClassScheduleApi,
    donePrivateClassScheduleApi,
    editPrivateClassScheduleApi,
    getPrivateClassScheduleApi,
} from '@/api/scheduleApi';
import { dateFormater } from '@/utils/formaters';
import { MdClose, MdEditSquare } from 'react-icons/md';
import { FaTrashAlt } from 'react-icons/fa';
import { BsCheckCircleFill } from 'react-icons/bs';

export default function EditPrivateClass() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const { data: privateClass, isLoading } = useQuery(
        ['privateClassDetail', id],
        () => getDetailPrivateClassApi(id),
        {
            enabled: !!id,
            select: (res) => res?.data,
        }
    );

    const [editorData, setEditorData] = useState('');
    const [form, setForm] = useState({
        subjectId: '',
        learningMethodId: '',
        gradeId: '',
        address: '',
        price: '',
        status: '',
    });

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        const regex = /^[a-zA-Z0-9.]*$/;

        if (name == 'price' && value.match(regex)) {
            const formated = formatRupiah(value);

            setForm({ ...form, [name]: formated });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    useEffect(() => {
        setForm({
            subjectId: privateClass?.subject_id.toString(),
            learningMethodId: privateClass?.learning_method_id.toString(),
            gradeId: privateClass?.grade_id.toString(),
            address: privateClass?.address,
            price: formatRupiah(privateClass?.price),
            status: privateClass?.status ? '1' : '0',
        });

        setEditorData(privateClass?.description);

        return () => {
            setForm({
                subjectId: '',
                learningMethodId: '',
                gradeId: '',
                address: '',
                price: '',
                status: '',
            });

            setEditorData('');
        };
    }, [privateClass]);

    const { data: subjects, isLoading: isSubjectLoading } = useSubject({
        onSuccess: (data) => {
            dispatch(setSubjects(data));
        },
    });

    const { data: grades, isLoading: isGradeLoading } = useGrade({
        onSuccess: (data) => {
            dispatch(setGrades(data));
        },
    });

    const queryClient = useQueryClient();

    const { mutate, isLoading: isMutating } = useMutation(
        (payload) => updatePrivateClassApi(id, payload),
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries('privateClassDetail');
                queryClient.invalidateQueries('privateClass');
                navigate('/private-class');
                toast.success(data?.message || 'Berhasil mengubah kelas');
            },
            onError: (err) => {
                toast.error(err?.message || 'Terjadi kesalahan');
            },
        }
    );

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const payload = {
            subject_id: form.subjectId,
            learning_method_id: form.learningMethodId,
            grade_id: form.gradeId,
            address: form.address,
            price: parseRupiah(form.price),
            description: editorData,
            total_slot: 1,
            status: form.status,
        };

        mutate(payload);
    };

    const { data: schedules, isLoading: isScheduleLoading } = useQuery(
        ['privateClassSchedule', id],
        () =>
            getPrivateClassScheduleApi({
                classId: id,
            }),
        {
            enabled: !!id,
            select: (res) => res?.data,
        }
    );

    const [openAddModal, setOpenAddModal] = useState(false);

    const handleOpenAddModal = () => setOpenAddModal(!openAddModal);
    const toggleOpenAddModal = () => setOpenAddModal(!openAddModal);

    const [openDoneScheduleModal, setOpenDoneScheduleModal] = useState(false);

    const handleOpenDoneScheduleModal = (id) => {
        setSelectedScheduleId(id);
        setOpenDoneScheduleModal(!openDoneScheduleModal);
    };
    const toggleOpenDoneScheduleModal = () =>
        setOpenDoneScheduleModal(!openDoneScheduleModal);

    const { mutate: doneSchedule, isLoading: isDoneScheduleLoading } =
        useMutation(donePrivateClassScheduleApi, {
            onSuccess: (data) => {
                queryClient.invalidateQueries('privateClassSchedule');
                toast.success(data?.message || 'Berhasil menyelesaikan jadwal');
            },
            onError: (err) => {
                toast.error(err?.message || 'Terjadi kesalahan');
            },
        });

    const handleDoneSchedule = () => {
        doneSchedule(selectedScheduleId);
    };

    const rows = useMemo(
        () =>
            schedules?.data?.length > 0
                ? schedules?.data?.map((item, i) => ({
                      count: i + 1,
                      id: item?.id,
                      //   subject: item?.subject?.name,
                      //   grade: item?.grade?.name,
                      date: dateFormater(item?.date),
                      time: `${item?.time} WIB`,
                      learningMethod: item?.learning_method?.name,
                  }))
                : [],
        [schedules]
    );

    const columns = [
        {
            header: 'No',
            accessorKey: 'count',
        },
        // {
        //     header: 'Mata Pelajaran',
        //     accessorKey: 'subject',
        // },
        // {
        //     header: 'Jenjang',
        //     accessorKey: 'grade',
        // },
        {
            header: 'Tanggal',
            accessorKey: 'date',
        },
        {
            header: 'Jam',
            accessorKey: 'time',
        },
        {
            header: 'Metode Pembelajaran',
            accessorKey: 'learningMethod',
        },
        {
            header: 'Action',
            accessorKey: 'id',
            cell: (info) => (
                <span className='flex items-center space-x-4'>
                    <IconButton
                        color='green'
                        onClick={() =>
                            handleOpenDoneScheduleModal(info.getValue())
                        }
                    >
                        <BsCheckCircleFill size={16} />
                    </IconButton>
                    <IconButton
                        color='blue'
                        onClick={() => handleOpenEditModal(info.getValue())}
                    >
                        <MdEditSquare size={18} />
                    </IconButton>
                    <IconButton
                        color='red'
                        onClick={() => handleOpenDeleteDialog(info.getValue())}
                        disabled={isDeleteScheduleLoading}
                    >
                        {isDeleteScheduleLoading ? (
                            <Spinner color='white' size={'sm'} />
                        ) : (
                            <FaTrashAlt size={14} />
                        )}
                    </IconButton>
                </span>
            ),
        },
    ];

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

    const { mutate: addSchedule, isLoading: isAddScheduleLoading } =
        useMutation(
            (payload) =>
                addPrivateClassScheduleApi({
                    classId: id,
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

    const [selectedScheduleId, setSelectedScheduleId] = useState(null);

    const { mutate: deleteSchedule, isLoading: isDeleteScheduleLoading } =
        useMutation(
            (selectedScheduleId) =>
                deletePrivateClassScheduleApi(selectedScheduleId),
            {
                onSuccess: (data) => {
                    queryClient.invalidateQueries('privateClassSchedule');
                    toast.success(data?.message || 'Berhasil menghapus jadwal');
                    toggleDeleteDialog();
                },
                onError: (err) => {
                    toast.error(err?.message || 'Terjadi kesalahan');
                    toggleDeleteDialog();
                },
            }
        );

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const toggleDeleteDialog = () => setOpenDeleteDialog(!openDeleteDialog);

    const handleOpenDeleteDialog = (id) => {
        setSelectedScheduleId(id);
        toggleDeleteDialog();
    };

    const handleDeleteSchedule = () => {
        deleteSchedule(selectedScheduleId);
    };

    const [openEditModal, setOpenEditModal] = useState(false);

    const toggleOpenEditModal = () => setOpenEditModal(!openEditModal);

    const handleOpenEditModal = (id) => {
        setSelectedScheduleId(id);

        const selected = schedules?.data?.find((item) => item.id === id);

        if (selected) {
            const formData = {
                date: new Date(selected?.date).toLocaleDateString('en-CA'),
                time: selected?.time,
                meetingLink: selected?.meeting_link,
                meetingPlatform: selected?.meeting_platform.toString(),
            };

            setScheduleForm(formData);

            toggleOpenEditModal();
        } else {
            toast.error('Silahkan coba lagi nanti');
        }
    };

    const { mutate: editSchedule, isLoading: isEditScheduleLoading } =
        useMutation(
            (payload) =>
                editPrivateClassScheduleApi({
                    scheduleId: selectedScheduleId,
                    data: payload,
                }),
            {
                onSuccess: (data) => {
                    queryClient.invalidateQueries('privateClassSchedule');
                    toast.success(data?.message || 'Berhasil mengubah jadwal');
                    toggleOpenEditModal();
                },
                onError: (err) => {
                    toast.error(err?.message || 'Terjadi kesalahan');
                },
            }
        );

    const handleEditSchedule = (e) => {
        e.preventDefault();

        const payload = {
            meeting_link: scheduleForm.meetingLink,
            meeting_platform: scheduleForm.meetingPlatform,
            date: scheduleForm.date,
            time: scheduleForm.time,
        };

        editSchedule(payload);
    };

    if (isLoading || isSubjectLoading || isGradeLoading)
        return <ScreenLoading />;

    if (!isLoading && Array.isArray(privateClass)) return <ScreenNotFound />;

    return (
        <main className='space-y-10'>
            <SectionWrapper
                title='Edit Kelas Private'
                subTitle='Menu ini digunakan untuk mengedit kelas private'
            >
                <form className='py-4' onSubmit={handleFormSubmit}>
                    <main className='flex flex-col gap-6 mb-4'>
                        <Select
                            size='lg'
                            name='learningMethodId'
                            label='Metode Belajar'
                            variant='outlined'
                            value={String(form.learningMethodId)}
                            onChange={(value) =>
                                setForm({
                                    ...form,
                                    learningMethodId: String(value),
                                })
                            }
                            required
                        >
                            <Option value='1'>Online</Option>
                            <Option value='2'>Offline</Option>
                        </Select>
                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                            <Select
                                size='lg'
                                name='subjectId'
                                label='Mata Pelajaran'
                                variant='outlined'
                                value={String(form.subjectId)}
                                onChange={(value) =>
                                    setForm({ ...form, subjectId: value })
                                }
                                required
                            >
                                {subjects?.map((subject, i) => (
                                    <Option
                                        key={i}
                                        value={String(subject.id)}
                                        color='blue'
                                    >
                                        {subject.name}
                                    </Option>
                                ))}
                            </Select>
                            <Select
                                size='lg'
                                name='gradeId'
                                label='Jenjang Kelas'
                                variant='outlined'
                                value={String(form.gradeId)}
                                onChange={(value) =>
                                    setForm({ ...form, gradeId: value })
                                }
                                required
                            >
                                {grades?.map((grade, i) => (
                                    <Option
                                        key={i}
                                        value={String(grade.id)}
                                        color='blue'
                                    >
                                        {grade.name}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        {form.learningMethodId === '2' && (
                            <Input
                                size='lg'
                                name='address'
                                label='Lokasi Pembelajaran'
                                variant='outlined'
                                value={form?.address}
                                onChange={handleOnChange}
                            />
                        )}
                        <Input
                            size='lg'
                            name='price'
                            label='Harga'
                            variant='outlined'
                            value={form?.price}
                            onChange={handleOnChange}
                        />
                        <CKEditor
                            editor={ClassicEditor}
                            data={editorData}
                            onChange={(_, editor) => {
                                const data = editor.getData();
                                setEditorData(data);
                            }}
                        />
                        <Select
                            size='lg'
                            name='status'
                            label='Status Kelas'
                            variant='outlined'
                            value={String(form.status)}
                            onChange={(value) =>
                                setForm({
                                    ...form,
                                    status: String(value),
                                })
                            }
                            required
                        >
                            <Option value='1'>Published</Option>
                            <Option value='0'>Dafted</Option>
                        </Select>
                    </main>

                    <footer className='flex justify-end mt-6'>
                        <Button
                            type='submit'
                            color='blue'
                            variant='filled'
                            disabled={isMutating}
                        >
                            {isMutating ? (
                                <Spinner color='white' size={'lg'} />
                            ) : (
                                'Buat'
                            )}
                        </Button>
                    </footer>
                </form>
            </SectionWrapper>

            {isScheduleLoading ? (
                <div className='flex-col gap-3 flexCenter'>
                    <Spinner color='blue' className='w-10 h-10' />
                    <Typography color='gray' variant={'small'}>
                        Sedang memuat jadwal kelas private
                    </Typography>
                </div>
            ) : (
                <SectionWrapper
                    title='Jadwal Kelas Private'
                    subTitle='Table ini digunakan untuk melihat, membuat, mengubah, dan menghapus jadwal kelas private'
                >
                    <MainTable
                        columns={columns}
                        data={rows}
                        addAction={
                            schedules?.total > 0 ? null : handleOpenAddModal
                        }
                    />
                </SectionWrapper>
            )}

            <Dialog open={openAddModal} handler={toggleOpenAddModal} size='sm'>
                <div className='flex items-center justify-between'>
                    <DialogHeader>Tambahkan Jadwal</DialogHeader>
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

                        {parseInt(privateClass?.learning_method_id) === 1 && (
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
                                    required
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
                                    required
                                />
                            </>
                        )}
                    </form>
                </DialogBody>
                <DialogFooter className='space-x-2'>
                    <Button
                        type='button'
                        variant='outlined'
                        color='red'
                        onClick={toggleOpenAddModal}
                    >
                        Batalkan
                    </Button>
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
                            'Tambahkan'
                        )}
                    </Button>
                </DialogFooter>
            </Dialog>

            <Dialog
                open={openEditModal}
                handler={toggleOpenEditModal}
                size='sm'
            >
                <div className='flex items-center justify-between'>
                    <DialogHeader>Ubah Jadwal</DialogHeader>
                    <IconButton
                        color='blue-gray'
                        size='sm'
                        variant='text'
                        onClick={toggleOpenEditModal}
                        className='mr-4'
                    >
                        <MdClose size={20} />
                    </IconButton>
                </div>
                <DialogBody divider>
                    <form
                        onSubmit={handleEditSchedule}
                        id='editScheduleForm'
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

                        {parseInt(privateClass?.learning_method_id) === 1 && (
                            <>
                                <Select
                                    name='meetingPlatform'
                                    label='Meeting Platform'
                                    value={scheduleForm?.meetingPlatform}
                                    onChange={(value) =>
                                        setScheduleForm({
                                            ...scheduleForm,
                                            meetingPlatform: value,
                                        })
                                    }
                                    required
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
                                    required
                                />
                            </>
                        )}
                    </form>
                </DialogBody>
                <DialogFooter className='space-x-2'>
                    <Button
                        type='button'
                        variant='outlined'
                        color='red'
                        onClick={toggleOpenEditModal}
                    >
                        Batalkan
                    </Button>
                    <Button
                        variant='gradient'
                        color='green'
                        form='editScheduleForm'
                        type='submit'
                        disabled={isEditScheduleLoading}
                    >
                        {isEditScheduleLoading ? (
                            <Spinner color='white' size={'sm'} />
                        ) : (
                            'Ubah'
                        )}
                    </Button>
                </DialogFooter>
            </Dialog>

            <Dialog
                open={openDeleteDialog}
                handler={toggleDeleteDialog}
                size='xs'
            >
                <DialogHeader className='justify-between'>
                    <Typography variant='h5' color='blue-gray'>
                        Hapus Jadwal
                    </Typography>
                    <IconButton
                        color='blue-gray'
                        size='sm'
                        variant='text'
                        onClick={toggleDeleteDialog}
                    >
                        <MdClose size={20} />
                    </IconButton>
                </DialogHeader>
                <DialogBody
                    divider
                    className='grid gap-2 py-8 place-items-center'
                >
                    <Typography
                        color='red'
                        variant='lead'
                        className={'text-center mx-10 '}
                    >
                        Anda yakin ingin menghapus jadwal ini?
                    </Typography>
                </DialogBody>
                <DialogFooter className='space-x-2'>
                    <Button
                        variant='text'
                        color='blue-gray'
                        onClick={toggleDeleteDialog}
                    >
                        Tutup
                    </Button>
                    <Button
                        variant='filled'
                        color='red'
                        onClick={handleDeleteSchedule}
                        disabled={isDeleteScheduleLoading}
                    >
                        {isDeleteScheduleLoading ? (
                            <Spinner className='w-6 h-6' color='light-blue' />
                        ) : (
                            'Hapus'
                        )}
                    </Button>
                </DialogFooter>
            </Dialog>

            <Dialog
                open={openDoneScheduleModal}
                handler={toggleOpenDoneScheduleModal}
                size='xs'
            >
                <DialogHeader className='justify-between'>
                    <Typography variant='h5' color='blue-gray'>
                        Selesaikan Jadwal
                    </Typography>
                    <IconButton
                        color='blue-gray'
                        size='sm'
                        variant='text'
                        onClick={toggleOpenDoneScheduleModal}
                    >
                        <MdClose size={20} />
                    </IconButton>
                </DialogHeader>
                <DialogBody
                    divider
                    className='grid gap-2 py-8 place-items-center'
                >
                    <Typography
                        color='red'
                        variant='lead'
                        className={'text-center mx-10 '}
                    >
                        Anda yakin ingin menyelesaikan jadwal ini?
                    </Typography>
                </DialogBody>
                <DialogFooter className='space-x-2'>
                    <Button
                        variant='text'
                        color='blue-gray'
                        onClick={toggleOpenDoneScheduleModal}
                    >
                        Tutup
                    </Button>
                    <Button
                        variant='filled'
                        color='green'
                        onClick={handleDoneSchedule}
                        disabled={isDoneScheduleLoading}
                    >
                        {isDoneScheduleLoading ? (
                            <Spinner className='w-6 h-6' color='light-blue' />
                        ) : (
                            'Selesaikan'
                        )}
                    </Button>
                </DialogFooter>
            </Dialog>
        </main>
    );
}
