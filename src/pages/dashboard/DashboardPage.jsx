import ProgressStat from '@/components/stats/ProgressStat';

import { FaBookReader } from 'react-icons/fa';
import { BsFillCalendar2CheckFill } from 'react-icons/bs';
import { MdAssignmentAdd, MdAssignmentTurnedIn } from 'react-icons/md';
import SectionWrapper from '@/components/wrappers/SectionWrapper';
import MainTable from '@/components/tables/MainTable';
import { useMemo } from 'react';

export default function DashboardPage() {
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
                    value={'0'}
                    icon={<FaBookReader size={26} />}
                    color={'bg-red-500'}
                />
                <ProgressStat
                    title={'Jadwal'}
                    value={'0'}
                    icon={<BsFillCalendar2CheckFill size={20} />}
                    color={'bg-blue-500'}
                />
                <ProgressStat
                    title={'Pemesanan'}
                    value={'0'}
                    icon={<MdAssignmentAdd size={26} />}
                    color={'bg-cyan-500'}
                />
                <ProgressStat
                    title={'Kelas Selesai'}
                    value={'0'}
                    icon={<MdAssignmentTurnedIn size={26} />}
                    color={' bg-green-500'}
                />
            </section>

            <SectionWrapper
                title='Pemesanan Terkini'
                subTitle='Table ini menampilkan pemesanan terkini'
                wrapperClassName='mt-8'
            >
                <MainTable rows={rows} columns={columns} isLoading={true} />
            </SectionWrapper>
        </>
    );
}
