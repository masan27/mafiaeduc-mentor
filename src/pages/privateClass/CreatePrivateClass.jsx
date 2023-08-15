import ScreenLoading from '@/components/handlers/ScreenLoading';
import SectionWrapper from '@/components/wrappers/SectionWrapper';
import useGrade from '@/hooks/apis/useGrade';
import useSubject from '@/hooks/apis/useSubject';
import { setGrades } from '@/stores/reducers/gradeSlice';
import { setSubjects } from '@/stores/reducers/subjectSlice';
import {
    Button,
    Input,
    Option,
    Select,
    Spinner,
} from '@material-tailwind/react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useMutation } from '@tanstack/react-query';
import { createPrivateClassApi } from '@/api/privateClassApi';
import { formatRupiah, parseRupiah } from '@/utils/helpers';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function CreatePrivateClass() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [editorData, setEditorData] = useState('');
    const [form, setForm] = useState({
        subjectId: '',
        learningMethodId: '',
        gradeId: '',
        address: '',
        price: '',
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

    const { mutate, isLoading } = useMutation(
        (payload) => createPrivateClassApi(payload),
        {
            onSuccess: (data) => {
                toast.success(
                    data?.message || 'Berhasil membuat kelas private'
                );
                navigate('/private-class');
            },
            onError: (err) => {
                toast.error(err?.message || 'Gagal membuat kelas private');
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
        };

        mutate(payload);
    };

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

    if (isSubjectLoading || isGradeLoading)
        return (
            <ScreenLoading
                className='h-[calc(100vh-220px)]'
                text={'Memuat...'}
            />
        );

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
                            value={form.learningMethodId}
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
                                value={form.subjectId}
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
                                value={form.gradeId}
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
                    </main>

                    <footer className='flex justify-end mt-6'>
                        <Button
                            type='submit'
                            color='blue'
                            variant='filled'
                            disabled={isLoading}
                        >
                            {isLoading ? (
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
