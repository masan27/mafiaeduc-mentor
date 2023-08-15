import { deletePrivateClassApi } from '@/api/privateClassApi';
import StatusBadge from '@/components/badges/StatusBadge';
import MainTable from '@/components/tables/MainTable';
import SectionWrapper from '@/components/wrappers/SectionWrapper';
import usePrivateClass from '@/hooks/apis/usePrivateClass';
import { dateFormater } from '@/utils/formaters';
import {
    Button,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader,
    IconButton,
    Spinner,
    Typography,
} from '@material-tailwind/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { MdClose, MdEditSquare } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function PrivateClass() {
    const navigate = useNavigate();

    const [selectedId, setSelectedId] = useState(null);
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(10);
    const [search, setSearch] = useState('');

    const toggleDeleteDialog = () => setOpen(!open);

    const handleOpenDeleteDialog = (id) => {
        toggleDeleteDialog();
        setSelectedId(id);
    };

    const handleNavigateToEdit = (id) => {
        navigate(`/private-class/edit/${id}`);
    };

    const { data: privateClass, isLoading } = usePrivateClass({
        page,
        count,
        search,
    });

    const canPreviousPage = useMemo(() => {
        return page > 1;
    }, [page]);

    const canNextPage = useMemo(() => {
        return privateClass?.last_page > page;
    }, [page, privateClass]);

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
            privateClass?.data?.length > 0
                ? privateClass?.data?.map((item) => ({
                      id: item?.id,
                      subject: item?.subject?.name,
                      learningMethod: item?.learning_method?.name,
                      grade: item?.grade?.name,
                      status: item?.status,
                      createdAt: dateFormater(item?.created_at),
                  }))
                : [],
        [privateClass]
    );

    const columns = [
        {
            header: 'ID',
            accessorKey: 'id',
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
            header: 'Status',
            accessorKey: 'status',
            cell: (info) => <StatusBadge status={info.getValue()} />,
        },
        {
            header: 'Tanggal Dibuat',
            accessorKey: 'createdAt',
        },
        {
            header: 'Action',
            accessorKey: 'id',
            cell: (info) => (
                <span className='flex items-center space-x-4'>
                    <IconButton
                        color='blue'
                        onClick={() => handleNavigateToEdit(info.getValue())}
                    >
                        <MdEditSquare size={18} />
                    </IconButton>
                    <IconButton
                        color='red'
                        onClick={() => handleOpenDeleteDialog(info.getValue())}
                    >
                        <FaTrashAlt size={14} />
                    </IconButton>
                </span>
            ),
        },
    ];

    const queryClient = useQueryClient();

    const { mutate: deletePrivateClass, isLoading: isDeletePrivateClass } =
        useMutation(deletePrivateClassApi, {
            onSuccess: () => {
                toast.success('Kelas private berhasil dihapus');
                toggleDeleteDialog();
                queryClient.invalidateQueries('privateClass');
            },
            onError: (err) => {
                toast.error(err?.mesage || 'Kelas private gagal dihapus');
            },
        });

    const handleDeletePrivateClass = () => {
        deletePrivateClass(selectedId);
    };

    return (
        <>
            <SectionWrapper
                title='Kelas Private'
                subTitle='Table ini menampilkan daftar kelas private yang telah dibuat'
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
                    pageCount={privateClass?.last_page}
                    setSearch={setSearch}
                />
            </SectionWrapper>

            <Dialog open={open} handler={toggleDeleteDialog} size='xs'>
                <DialogHeader className='justify-between'>
                    <Typography variant='h5' color='blue-gray'>
                        Hapus Kelas Private
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
                        Anda yakin ingin menghapus kelas private ini?
                    </Typography>
                </DialogBody>
                <DialogFooter className='space-x-2'>
                    <Button
                        variant='text'
                        color='blue-gray'
                        onClick={toggleDeleteDialog}
                    >
                        close
                    </Button>
                    <Button
                        variant='filled'
                        color='red'
                        onClick={handleDeletePrivateClass}
                        disabled={isDeletePrivateClass}
                    >
                        {isDeletePrivateClass ? (
                            <Spinner className='w-6 h-6' color='light-blue' />
                        ) : (
                            'Hapus'
                        )}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
