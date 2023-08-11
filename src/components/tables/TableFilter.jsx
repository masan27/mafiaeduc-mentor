import { Input } from '@material-tailwind/react';
import { BiSearch } from 'react-icons/bi';

export default function TableFilter({ filter = '', setFilter }) {
    return (
        <div className='form-control'>
            <Input
                type='text'
                variant='outlined'
                color='blue-gray'
                value={filter}
                label={'Search...'}
                onChange={(e) => setFilter(e.target.value)}
                icon={<BiSearch size={16} />}
            />
        </div>
    );
}
