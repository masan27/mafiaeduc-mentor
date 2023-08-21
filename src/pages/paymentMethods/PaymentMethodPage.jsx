import {
    addPaymentMethods,
    getAllPaymentMethods,
    getGlobalPaymentMethods,
} from '@/api/paymentMethodApi';
import MainTable from '@/components/tables/MainTable';
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { PiWarningBold } from 'react-icons/pi';

export default function PaymentMethodPage() {
    const [search, setSearch] = useState('');

    const { data: paymentMethods, isLoading } = useQuery(
        ['paymentMethods', search],
        () =>
            getAllPaymentMethods({
                search,
            }),
        {
            select: (data) => data.data,
        }
    );

    const handleOpenDeleteDialog = (id) => {
        console.log(id);
    };

    const rows = useMemo(
        () =>
            paymentMethods?.length > 0
                ? paymentMethods?.map((item, i) => ({
                      id: item?.id,
                      count: i + 1,
                      accountName: item?.account_name,
                      bankName: item?.bank_name,
                      accountNumber: item?.account_number,
                  }))
                : [],
        [paymentMethods]
    );

    const columns = [
        {
            header: 'No',
            accessorKey: 'count',
        },
        {
            header: 'Nama Akun',
            accessorKey: 'accountName',
        },
        {
            header: 'Nama Bank',
            accessorKey: 'bankName',
        },
        {
            header: 'Nomor Rekening',
            accessorKey: 'accountNumber',
        },
        {
            header: 'Action',
            accessorKey: 'id',
            cell: (info) => (
                <span className='flex items-center space-x-4'>
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

    const [openAddModal, setOpenAddModal] = useState(false);
    const toggleOpenAddModal = () => setOpenAddModal(!openAddModal);

    const {
        data: globalPaymentMethods,
        isLoading: isGlobalPaymentMethodLoading,
    } = useQuery(['globalPaymentMethods', search], getGlobalPaymentMethods, {
        select: (data) => data.data,
    });

    const [paymentMethodForm, setPaymentMethodForm] = useState({
        paymentMethodId: '',
        accountName: '',
        accountNumber: '',
        bankName: '',
    });

    const handlePaymentMethodFormChange = (e) => {
        const { name, value } = e.target;

        setPaymentMethodForm({
            ...paymentMethodForm,
            [name]: value,
        });
    };

    const queryClient = useQueryClient();

    const { mutate: addPaymentMethod, isLoading: isAddPaymentMethodLoading } =
        useMutation((data) => addPaymentMethods(data), {
            onSuccess: () => {
                queryClient.invalidateQueries('paymentMethods');
                toggleOpenAddModal();
            },
        });

    const handleAddAction = (e) => {
        e.preventDefault();

        const payload = {
            payment_method_id: paymentMethodForm?.paymentMethodId,
            account_name: paymentMethodForm?.accountName,
            account_number: paymentMethodForm?.accountNumber,
            bank_name: paymentMethodForm?.bankName,
        };

        addPaymentMethod(payload);
    };

    return (
        <>
            <SectionWrapper
                title='Metode Pembayaran'
                subTitle='Table ini menampilkan semua metode pembayaran yang akan digunakan untuk mendapatkan pembayaran dari total pembelian yang dilakukan oleh pelanggan.'
                wrapperClassName='mt-8'
            >
                <MainTable
                    data={rows}
                    columns={columns}
                    isLoading={isLoading}
                    setSearch={setSearch}
                    addAction={toggleOpenAddModal}
                />
            </SectionWrapper>

            <Dialog open={openAddModal} handler={toggleOpenAddModal} size='sm'>
                <div className='flex items-center justify-between'>
                    <DialogHeader>Tambah Metode Pembayaran</DialogHeader>
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
                    {isGlobalPaymentMethodLoading ? (
                        <div className='flex items-center justify-center h-32'>
                            <Spinner color='blue' className='w-10 h-10' />
                        </div>
                    ) : !isGlobalPaymentMethodLoading &&
                      globalPaymentMethods &&
                      globalPaymentMethods?.length > 0 ? (
                        <div className='flex flex-col items-center justify-center h-40 gap-4'>
                            <PiWarningBold size={50} color='#f44336' />
                            <Typography color='blue-gray' variant={'lead'}>
                                Maaf, Metode pembayaran belum tersedia!
                            </Typography>
                        </div>
                    ) : !isGlobalPaymentMethodLoading &&
                      globalPaymentMethods &&
                      globalPaymentMethods?.length === 0 ? (
                        <form
                            onSubmit={handleAddAction}
                            id='addPaymentMethodForm'
                            className='grid gap-6'
                        >
                            <Select
                                name='paymentMethodId'
                                label='Metode Pembayaran'
                                value={paymentMethodForm?.paymentMethodId}
                                onChange={(value) => {
                                    setPaymentMethodForm({
                                        ...paymentMethodForm,
                                        paymentMethodId: value,
                                    });
                                }}
                            >
                                {globalPaymentMethods?.map((item) => (
                                    <Option
                                        key={item?.id}
                                        value={item?.id}
                                        label={item?.name}
                                    />
                                ))}
                            </Select>

                            <Input
                                name='accountName'
                                label='Nama Akun'
                                value={paymentMethodForm?.accountName}
                                onChange={handlePaymentMethodFormChange}
                                required
                            />
                            <Input
                                name='accountNumber'
                                label='Nomor Rekening'
                                type='number'
                                value={paymentMethodForm?.accountNumber}
                                onChange={handlePaymentMethodFormChange}
                                required
                            />
                            <Input
                                name='bankName'
                                label='Nama Pembayaran'
                                value={paymentMethodForm?.bankName}
                                onChange={handlePaymentMethodFormChange}
                                required
                            />
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
                    <Button
                        variant='gradient'
                        color='green'
                        form='addPaymentMethodForm'
                        type='submit'
                        disabled={isAddPaymentMethodLoading}
                    >
                        {isAddPaymentMethodLoading ? (
                            <Spinner color='white' size={'sm'} />
                        ) : (
                            'Buat'
                        )}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
