import TableNoData from './TableNoData';
import TableFilter from './TableFilter';

import { MdAdd } from 'react-icons/md';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import TableLoading from './TableLoading';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFacetedMinMaxValues,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import {
    Button,
    ButtonGroup,
    Option,
    Select,
    Typography,
} from '@material-tailwind/react';

export default function MainTable({
    addAction,
    nextPageAction,
    prevPageAction,
    canPreviousPage,
    canNextPage,
    currentPage = 1,
    pageCount = 1,
    pageSize = '10',
    setPageSize,
    data = [],
    columns = [],
    search = '',
    setSearch,
    isLoading,
}) {
    const [dataTable, setDataTable] = useState(() => [...data]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');

    useEffect(() => {
        setDataTable(data);
    }, [data]);

    const table = useReactTable({
        data: dataTable,
        columns,
        state: {
            columnFilters,
            globalFilter,
        },
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        debugTable: false,
        debugHeaders: false,
        debugColumns: false,
    });

    useEffect(() => {
        if (table.getState().columnFilters[0]?.id === 'fullName') {
            if (table.getState().sorting[0]?.id !== 'fullName') {
                table.setSorting([{ id: 'fullName', desc: false }]);
            }
        }
    }, [table]);

    return (
        <div className='w-full h-full px-4 py-2 overflow-auto'>
            {addAction || setSearch ? (
                <div className='gap-2 mb-6 flexBetween'>
                    {setSearch && (
                        <TableFilter filter={search} setFilter={setSearch} />
                    )}

                    {addAction && (
                        <Button
                            onClick={addAction}
                            variant='filled'
                            color='green'
                            className='flex items-center gap-2 ml-auto text-white'
                        >
                            <MdAdd size={18} />
                            <span>Create</span>
                        </Button>
                    )}
                </div>
            ) : null}

            <table className='w-full text-left table-auto min-w-max'>
                <thead>
                    {table.getHeaderGroups().map((headerGroup, index) => (
                        <tr key={index}>
                            {headerGroup.headers.map((header, index) => (
                                <th
                                    key={index}
                                    className='border-b border-blue-gray-100 '
                                >
                                    {header.isPlaceholder ? null : (
                                        <>
                                            <div
                                                {...{
                                                    className:
                                                        header.column.getCanSort() &&
                                                        !isLoading
                                                            ? 'cursor-pointer select-none p-4'
                                                            : 'p-4',
                                                    onClick: isLoading
                                                        ? null
                                                        : header.column.getToggleSortingHandler(),
                                                }}
                                            >
                                                <Typography
                                                    variant='small'
                                                    color='blue-gray'
                                                    className='font-normal leading-none opacity-70'
                                                >
                                                    {flexRender(
                                                        header.column.columnDef
                                                            .header,
                                                        header.getContext()
                                                    )}
                                                    {{
                                                        asc: ' 🔼',
                                                        desc: ' 🔽',
                                                    }[
                                                        header.column.getIsSorted()
                                                    ] ?? null}
                                                </Typography>
                                            </div>
                                        </>
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr className='relative'>
                            <TableLoading />
                        </tr>
                    ) : !isLoading &&
                      table.getRowModel()?.rows?.length === 0 ? (
                        <tr className='relative'>
                            <TableNoData />
                        </tr>
                    ) : !isLoading && table.getRowModel()?.rows?.length > 0 ? (
                        table.getRowModel()?.rows?.map((row, index) => (
                            <tr key={index} className='even:bg-blue-gray-50/50'>
                                {row.getVisibleCells().map((cell, index) => (
                                    <td key={index} className='p-4'>
                                        <Typography
                                            variant='small'
                                            color='blue-gray'
                                            className='font-normal'
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </Typography>
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : null}
                </tbody>
            </table>

            {nextPageAction || prevPageAction || setPageSize ? (
                <div className='pt-14 flexBetween'>
                    <div className='gap-4 flexCenter '>
                        <div>
                            <Select
                                size='md'
                                label='Rows per page'
                                value={pageSize.toString()}
                                onChange={(value) => {
                                    setPageSize(Number(value));
                                }}
                            >
                                {[10, 20, 30, 40, 50].map((pageSize, index) => (
                                    <Option
                                        key={index}
                                        value={String(pageSize)}
                                    >
                                        {pageSize}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        <span className='text-sm'>entries</span>
                    </div>
                    <div className='gap-4 flexCenter'>
                        <div className='justify-end w-36 flexCenter'>
                            <span className='text-sm'>Page</span>
                            <span className='mx-2 text-sm'>
                                <strong>
                                    {currentPage} of {pageCount}
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
                                onClick={prevPageAction}
                                size={'sm'}
                                color={'gray'}
                                variant={'outlined'}
                                disabled={!canPreviousPage}
                            >
                                <HiChevronLeft size={20} />
                            </Button>

                            <Button
                                onClick={nextPageAction}
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
            ) : null}
        </div>
    );
}
