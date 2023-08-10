import Header from '@/components/headers/Header';
import SideBar from '@/components/sidebar/SideBar';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
    return (
        <section className={'flex items-center justify-between'}>
            <SideBar />

            <div className={'w-full'}>
                <Header />

                <main
                    className={
                        'p-6 h-[calc(100vh-96px)] overflow-y-auto overflow-x-hidden bg-gray-50'
                    }
                >
                    <Outlet />
                </main>
            </div>
        </section>
    );
}
