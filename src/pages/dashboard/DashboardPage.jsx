import ProgressStat from '@/components/stats/ProgressStat';

import { FaBookReader, FaEye } from 'react-icons/fa';
import { BsFillCalendar2CheckFill } from 'react-icons/bs';
import { MdAssignmentAdd, MdAssignmentTurnedIn } from 'react-icons/md';
import SectionWrapper from '@/components/wrappers/SectionWrapper';
import MainTable from '@/components/tables/MainTable';
import { useMemo, useState } from 'react';
import useStats from '@/hooks/apis/useStats';
import useRecentSchedules from '@/hooks/apis/useRecentSchedules';
import { useSelector } from 'react-redux';
import { getUser } from '@/stores/reducers/authSlice';
import { dateFormater } from '@/utils/formaters';
import { IconButton } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
    const navigate = useNavigate();
    const user = useSelector(getUser);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(10);

    const { data: statsData, isLoading: isStatsLoading } = useStats();

    const { data: recentSchedules, isLoading: isRecentSchedulesLoading } =
        useRecentSchedules({ user, count, page });

    const canPreviousPage = useMemo(() => {
        return page > 1;
    }, [page]);

    const canNextPage = useMemo(() => {
        return recentSchedules?.last_page > page;
    }, [page, recentSchedules]);

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

    const handleNavigateToDetail = (classId) => {
        navigate(`/private-class/edit/${classId}`);
    };

    const rows = useMemo(
        () =>
            recentSchedules?.data?.length > 0
                ? recentSchedules?.data?.map((item) => ({
                      privateClassesId: item?.private_classes_id,
                      studentName: item?.users[0]?.detail?.full_name,
                      studentPhone: item?.users[0]?.detail?.phone,
                      subject: item?.subject?.name,
                      learningMethod: item?.learning_method?.name,
                      grade: item?.grade?.name,
                      date: dateFormater(item?.date),
                      time: `${item?.time} WIB`,
                  }))
                : [],
        [recentSchedules]
    );

    const columns = [
        {
            header: 'Mata Pelajaran',
            accessorKey: 'subject',
        },
        {
            header: 'Jadwal Belajar',
            accessorKey: 'date',
        },
        {
            header: 'Waktu Belajar',
            accessorKey: 'time',
        },
        {
            header: 'Nama Siswa',
            accessorKey: 'studentName',
        },
        {
            header: 'No. HP',
            accessorKey: 'studentPhone',
        },
        {
            header: 'Metode Belajar',
            accessorKey: 'learningMethod',
        },
        {
            header: 'Jenjang',
            accessorKey: 'grade',
        },
        {
            header: 'Action',
            accessorKey: 'privateClassesId',
            cell: (info) => (
                <span className='flex items-center space-x-4'>
                    <IconButton
                        color='blue'
                        onClick={() => handleNavigateToDetail(info.getValue())}
                        variant='outlined'
                    >
                        <FaEye size={18} />
                    </IconButton>
                </span>
            ),
        },
    ];

    return (
        <>
            <section className='grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-4'>
                <ProgressStat
                    title={'Kelas Private'}
                    value={statsData?.total_private_class || '0'}
                    icon={<FaBookReader size={26} />}
                    color={'bg-red-500'}
                    isLoading={isStatsLoading}
                />
                <ProgressStat
                    title={'Jadwal'}
                    value={statsData?.total_scheduled_class || '0'}
                    icon={<BsFillCalendar2CheckFill size={20} />}
                    color={'bg-blue-500'}
                    isLoading={isStatsLoading}
                />
                <ProgressStat
                    title={'Pemesanan'}
                    value={statsData?.total_order || '0'}
                    icon={<MdAssignmentAdd size={26} />}
                    color={'bg-cyan-500'}
                    isLoading={isStatsLoading}
                />
                <ProgressStat
                    title={'Kelas Selesai'}
                    value={statsData?.total_finished_class || '0'}
                    icon={<MdAssignmentTurnedIn size={26} />}
                    color={' bg-green-500'}
                    isLoading={isStatsLoading}
                />
            </section>

            <SectionWrapper
                title='Jadwal Terkini'
                subTitle='Table ini menampilkan jadwal yang akan datang'
                wrapperClassName='mt-8'
            >
                <MainTable
                    data={rows}
                    columns={columns}
                    isLoading={isRecentSchedulesLoading}
                    setPageSize={setCount}
                    nextPageAction={nextPage}
                    prevPageAction={prevPage}
                    canNextPage={canNextPage}
                    canPreviousPage={canPreviousPage}
                    currentPage={page}
                    pageCount={recentSchedules?.last_page}
                />
            </SectionWrapper>
        </>
    );
}
