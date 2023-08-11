import ProgressStat from '@/components/stats/ProgressStat';

import { FaBookReader } from 'react-icons/fa';
import { BsFillCalendar2CheckFill } from 'react-icons/bs';
import { MdAssignmentAdd, MdAssignmentTurnedIn } from 'react-icons/md';
import SectionWrapper from '@/components/wrappers/SectionWrapper';
import MainTable from '@/components/tables/MainTable';

export default function DashboardPage() {
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
                <MainTable />
            </SectionWrapper>
        </>
    );
}
