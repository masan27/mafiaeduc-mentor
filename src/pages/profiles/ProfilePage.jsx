import ChangePasswordSection from './partials/ChangePasswordSection';
import ProfileSection from './partials/ProfileSection';

export default function ProfilePage() {
    return (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className='col-span-1 lg:col-span-3 2xl:col-span-2'>
                <ProfileSection />
            </div>

            <div className='col-span-1 lg:col-span-3 2xl:col-span-1'>
                <ChangePasswordSection />
            </div>
        </div>
    );
}
