import { Spinner } from '@material-tailwind/react';

const TableLoading = ({ ...props }) => {
    return (
        <td className='absolute -translate-x-1/2 left-1/2 top-8' {...props}>
            <Spinner className='w-12 h-12' color='blue-gray' />
        </td>
    );
};

export default TableLoading;
