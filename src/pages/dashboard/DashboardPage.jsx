import ProgressStat from '@/components/stats/ProgressStat';

import { FaBookReader } from 'react-icons/fa';
import { BsFillCalendar2CheckFill } from 'react-icons/bs';
import { MdAssignmentAdd, MdAssignmentTurnedIn } from 'react-icons/md';
import SectionWrapper from '@/components/wrappers/SectionWrapper';
import MainTable from '@/components/tables/MainTable';
import { useMemo } from 'react';
import useStats from '@/hooks/apis/useStats';
import useRecentSchedules from '@/hooks/apis/useRecentSchedules';
import { useSelector } from 'react-redux';
import { getUser } from '@/stores/reducers/authSlice';

export default function DashboardPage() {
    const user = useSelector(getUser);

    const { data: statsData, isLoading: isStatsLoading } = useStats();

    const { data: recentSchedules, isLoading: isRecentSchedulesLoading } =
        useRecentSchedules({ user });

    console.log(recentSchedules);

    const rows = useMemo(
        () => [
            {
                firstName: 'tanner',
                lastName: 'linsley',
                age: 24,
                visits: 100,
                status: 'In Relationship',
                progress: 50,
            },
            {
                firstName: 'tandy',
                lastName: 'miller',
                age: 40,
                visits: 40,
                status: 'Single',
                progress: 80,
            },
            {
                firstName: 'joe',
                lastName: 'dirte',
                age: 45,
                visits: 20,
                status: 'Complicated',
                progress: 10,
            },
        ],
        []
    );

    const columns = useMemo(
        () => [
            {
                header: 'First Name',
                accessorKey: 'firstName',
            },
            {
                header: 'Last Name',
                accessorKey: 'lastName',
            },
            {
                header: 'Age',
                accessorKey: 'age',
            },
            {
                header: 'Visits',
                accessorKey: 'visits',
            },
            {
                header: 'Status',
                accessorKey: 'status',
            },
            {
                header: 'Profile Progress',
                accessorKey: 'progress',
            },
        ],
        []
    );

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
                    rows={rows}
                    columns={columns}
                    isLoading={isRecentSchedulesLoading}
                />
            </SectionWrapper>
        </>
    );
}
