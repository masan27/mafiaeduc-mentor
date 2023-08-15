// eslint-disable-next-line react/prop-types
export default function ProgressStat({
    title,
    value,
    icon,
    isLoading,
    color = 'bg-blue-500',
}) {
    let content = null;

    if (isLoading) {
        content = (
            <div className={'w-full mb-4'}>
                <div
                    className={
                        'relative flex flex-col min-w-0 break-words bg-white rounded-xl shadow-lg'
                    }
                >
                    <div className={'flex-auto p-4 animate-pulse'}>
                        <div className={'flex flex-wrap'}>
                            <div
                                className={
                                    'relative w-full pr-4 max-w-full flex-grow flex-1'
                                }
                            >
                                <div className='py-2 bg-gray-200 rounded-full px-28 w-fit'></div>
                                <div className='px-8 py-4 mt-2 bg-gray-200 rounded-full w-fit'></div>
                            </div>
                            <div
                                className={'relative w-auto pl-4 flex-initial'}
                            >
                                <div
                                    className={
                                        'w-12 h-12 bg-gray-200 rounded-full'
                                    }
                                ></div>
                            </div>
                        </div>
                        <div className='py-2 mt-4 bg-gray-200 rounded-full px-14 w-fit'></div>
                    </div>
                </div>
            </div>
        );
    } else if (!isLoading) {
        content = (
            <div className={'w-full mb-4'}>
                <div
                    className={
                        'relative flex flex-col min-w-0 break-words bg-white rounded-xl shadow-lg'
                    }
                >
                    <div className={'flex-auto p-4'}>
                        <div className={'flex flex-wrap'}>
                            <div
                                className={
                                    'relative w-full pr-4 max-w-full flex-grow flex-1'
                                }
                            >
                                <h5
                                    className={
                                        'text-gray-500 uppercase font-bold text-xs'
                                    }
                                >
                                    {title}
                                </h5>
                                <span
                                    className={
                                        'font-semibold text-2xl text-gray-800'
                                    }
                                >
                                    {value}
                                </span>
                            </div>
                            <div
                                className={'relative w-auto pl-4 flex-initial'}
                            >
                                <div
                                    className={`text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full ${color}`}
                                >
                                    {icon}
                                </div>
                            </div>
                        </div>
                        <p className={'text-sm text-gray-500 mt-4'}>
                            <span className={'whitespace-nowrap'}>
                                Total dari semua data
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return content;
}
