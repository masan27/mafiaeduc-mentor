import {
    getDetailPrivateClassApi,
    updatePrivateClassApi,
} from '@/api/privateClassApi';
import ScreenLoading from '@/components/handlers/ScreenLoading';
import { formatRupiah, parseRupiah } from '@/utils/helpers';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ScreenNotFound from '../notFound/ScreenNotFound';
import SectionWrapper from '@/components/wrappers/SectionWrapper';
import {
    Button,
    Input,
    Option,
    Select,
    Spinner,
} from '@material-tailwind/react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { setSubjects } from '@/stores/reducers/subjectSlice';
import { useDispatch } from 'react-redux';
import { setGrades } from '@/stores/reducers/gradeSlice';
import useSubject from '@/hooks/apis/useSubject';
import useGrade from '@/hooks/apis/useGrade';
import { toast } from 'react-toastify';

export default function EditPrivateClass() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const { data: privateClass, isLoading } = useQuery(
        ['privateClassDetail', id],
        () => getDetailPrivateClassApi(id),
        {
            enabled: !!id,
            select: (res) => res?.data,
        }
    );

    const [editorData, setEditorData] = useState('');
    const [form, setForm] = useState({
        subjectId: '',
        learningMethodId: '',
        gradeId: '',
        address: '',
        price: '',
        status: '',
    });

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        const regex = /^[a-zA-Z0-9.]*$/;

        if (name == 'price' && value.match(regex)) {
            const formated = formatRupiah(value);

            setForm({ ...form, [name]: formated });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    useEffect(() => {
        setForm({
            subjectId: privateClass?.subject_id.toString(),
            learningMethodId: privateClass?.learning_method_id.toString(),
            gradeId: privateClass?.grade_id.toString(),
            address: privateClass?.address,
            price: formatRupiah(privateClass?.price),
            status: privateClass?.status ? '1' : '0',
        });

        setEditorData(privateClass?.description);

        return () => {
            setForm({
                subjectId: '',
                learningMethodId: '',
                gradeId: '',
                address: '',
                price: '',
                status: '',
            });

            setEditorData('');
        };
    }, [privateClass]);

    const { data: subjects, isLoading: isSubjectLoading } = useSubject({
        onSuccess: (data) => {
            dispatch(setSubjects(data));
        },
    });

    const { data: grades, isLoading: isGradeLoading } = useGrade({
        onSuccess: (data) => {
            dispatch(setGrades(data));
        },
    });

    const queryClient = useQueryClient();

    const { mutate, isLoading: isMutating } = useMutation(
        (payload) => updatePrivateClassApi(id, payload),
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries('privateClassDetail');
                queryClient.invalidateQueries('privateClass');
                navigate('/private-class');
                toast.success(data?.message || 'Berhasil mengubah kelas');
            },
            onError: (err) => {
                toast.error(
                    err?.response?.data?.message || 'Terjadi kesalahan'
                );
            },
        }
    );

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const payload = {
            subject_id: form.subjectId,
            learning_method_id: form.learningMethodId,
            grade_id: form.gradeId,
            address: form.address,
            price: parseRupiah(form.price),
            description: editorData,
            total_slot: 1,
            status: form.status,
        };

        mutate(payload);
    };

    if (isLoading || isSubjectLoading || isGradeLoading)
        return <ScreenLoading />;

    if (!isLoading && Array.isArray(privateClass)) return <ScreenNotFound />;

    return (
        <>
            <SectionWrapper
                title='Buat Kelas Private'
                subTitle='Menu ini digunakan untuk membuat kelas private'
            >
                <form className='py-4' onSubmit={handleFormSubmit}>
                    <main className='flex flex-col gap-6 mb-4'>
                        <Select
                            size='lg'
                            name='learningMethodId'
                            label='Metode Belajar'
                            variant='outlined'
                            value={String(form.learningMethodId)}
                            onChange={(value) =>
                                setForm({
                                    ...form,
                                    learningMethodId: String(value),
                                })
                            }
                            required
                        >
                            <Option value='1'>Online</Option>
                            <Option value='2'>Offline</Option>
                        </Select>
                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                            <Select
                                size='lg'
                                name='subjectId'
                                label='Mata Pelajaran'
                                variant='outlined'
                                value={String(form.subjectId)}
                                onChange={(value) =>
                                    setForm({ ...form, subjectId: value })
                                }
                                required
                            >
                                {subjects?.map((subject, i) => (
                                    <Option
                                        key={i}
                                        value={String(subject.id)}
                                        color='blue'
                                    >
                                        {subject.name}
                                    </Option>
                                ))}
                            </Select>
                            <Select
                                size='lg'
                                name='gradeId'
                                label='Jenjang Kelas'
                                variant='outlined'
                                value={String(form.gradeId)}
                                onChange={(value) =>
                                    setForm({ ...form, gradeId: value })
                                }
                                required
                            >
                                {grades?.map((grade, i) => (
                                    <Option
                                        key={i}
                                        value={String(grade.id)}
                                        color='blue'
                                    >
                                        {grade.name}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        {form.learningMethodId === '2' && (
                            <Input
                                size='lg'
                                name='address'
                                label='Lokasi Pembelajaran'
                                variant='outlined'
                                value={form?.address}
                                onChange={handleOnChange}
                            />
                        )}
                        <Input
                            size='lg'
                            name='price'
                            label='Harga'
                            variant='outlined'
                            value={form?.price}
                            onChange={handleOnChange}
                        />
                        <CKEditor
                            editor={ClassicEditor}
                            data={editorData}
                            onChange={(_, editor) => {
                                const data = editor.getData();
                                setEditorData(data);
                            }}
                        />
                        <Select
                            size='lg'
                            name='status'
                            label='Status Kelas'
                            variant='outlined'
                            value={String(form.status)}
                            onChange={(value) =>
                                setForm({
                                    ...form,
                                    status: String(value),
                                })
                            }
                            required
                        >
                            <Option value='1'>Published</Option>
                            <Option value='0'>Dafted</Option>
                        </Select>
                    </main>

                    <footer className='flex justify-end mt-6'>
                        <Button
                            type='submit'
                            color='blue'
                            variant='filled'
                            disabled={isMutating}
                        >
                            {isMutating ? (
                                <Spinner color='white' size={'lg'} />
                            ) : (
                                'Buat'
                            )}
                        </Button>
                    </footer>
                </form>
            </SectionWrapper>
        </>
    );
}
