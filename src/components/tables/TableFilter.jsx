import { Input } from '@material-tailwind/react';

export default function TableFilter({ filter, setFilter }) {
    return (
        <div className='form-control'>
            <Input
                type='text'
                label={'Search...'}
                onChange={(e) => setFilter(e.target.value)}
            />
        </div>
    );
}
