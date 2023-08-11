import TableNoData from './TableNoData';
import TableFilter from './TableFilter';

import { MdAdd } from 'react-icons/md';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import TableLoading from './TableLoading';
import { Button, ButtonGroup, Option, Select } from '@material-tailwind/react';

// eslint-disable-next-line react/prop-types
export default function MainTable({
    columns,
    data,
    addAction,
    noFilter,
    isLoading,
    pageSize,
    setPageSize,
    pageIndex,
    pageCount,
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
}) {
    return (
        <div className='px-4 py-2 overflow-x-auto'>
            <div className='gap-2 mb-4 flexBetween'>
                {!noFilter && (
                    <TableFilter filter={() => {}} setFilter={() => {}} />
                )}

                {addAction && (
                    <Button onClick={addAction} className='text-white'>
                        <MdAdd size={16} />
                        <span>Create</span>
                    </Button>
                )}
            </div>

            <table className='min-w-full text-sm font-light text-left border-b table-auto border-slate-500'>
                <thead>
                    {columns?.map((headerGroup, i) => (
                        <tr key={i}>
                            {headerGroup?.map((column, i) => (
                                <th key={i}>{column}</th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {!isLoading && data?.length > 0 ? (
                        data?.map((row, i) => {
                            return (
                                <tr key={i}>
                                    {row?.map((cell, i) => {
                                        return (
                                            <td
                                                key={i}
                                                className={
                                                    'border-b py-2 border-slate-700'
                                                }
                                            >
                                                {cell}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })
                    ) : isLoading ? (
                        <tr className='relative'>
                            <TableLoading />
                        </tr>
                    ) : (
                        <tr className='relative'>
                            <TableNoData />
                        </tr>
                    )}
                </tbody>
            </table>

            <div className='pt-14 flexBetween'>
                <div className='gap-4 flexCenter'>
                    <div>
                        <Select
                            size='md'
                            label='Rows per page'
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                            }}
                        >
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <Option key={pageSize} value={String(pageSize)}>
                                    {pageSize}
                                </Option>
                            ))}
                        </Select>
                    </div>
                    <span className='text-sm'>entries</span>
                </div>
                <div className='gap-4 flexCenter'>
                    <div className='flexCenter'>
                        <span className='text-sm'>Page</span>
                        <span className='mx-2 text-sm'>
                            <strong>
                                {pageIndex + 1} of {pageCount}
                            </strong>
                        </span>
                        <span>|</span>
                    </div>
                    <ButtonGroup
                        size={'sm'}
                        color={'gray'}
                        variant={'outlined'}
                    >
                        <Button
                            onClick={previousPage}
                            size={'sm'}
                            color={'gray'}
                            variant={'outlined'}
                            disabled={!canPreviousPage}
                        >
                            <HiChevronLeft size={20} />
                        </Button>

                        <Button
                            onClick={nextPage}
                            size={'sm'}
                            color={'gray'}
                            variant={'outlined'}
                            disabled={!canNextPage}
                        >
                            <HiChevronRight size={20} />
                        </Button>
                    </ButtonGroup>
                </div>
            </div>
        </div>
    );
}
