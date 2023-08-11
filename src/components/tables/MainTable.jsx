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
    pageIndex = 0,
    pageCount = 1,
    pageSize = 10,
    setPageSize,
    noFilter,
    data = [],
    columns = [],
    filter = '',
    setFilter,
    isLoading,
}) {
    const [dataTable, setDataTable] = useState(() => [...data]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');

    useEffect(() => {
        if (data.length > 0) setDataTable(() => [...data]);
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
            <div className='gap-2 mb-6 flexBetween'>
                {!noFilter && (
                    <TableFilter filter={filter} setFilter={setFilter} />
                )}

                {addAction && (
                    <Button onClick={addAction} className='text-white'>
                        <MdAdd size={16} />
                        <span>Create</span>
                    </Button>
                )}
            </div>

            <table className='w-full text-left table-auto min-w-max'>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
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
                        table.getRowModel()?.rows?.map((row) => (
                            <tr
                                key={row.id}
                                className='even:bg-blue-gray-50/50'
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className='p-4'>
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

            <div className='pt-14 flexBetween'>
                <div className='gap-4 flexCenter'>
                    <div>
                        <Select
                            size='md'
                            label='Rows per page'
                            value={String(pageSize)}
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
        </div>
    );
}
