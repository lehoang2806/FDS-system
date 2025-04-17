import { ChangeEvent, FC, useState } from 'react';
import { Formik, Field, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { selectUserLogin } from '@/app/selector';
import classNames from "classnames";
import { CreatePostModalProps } from './type';
import Modal from './Modal';
import Button from '../Elements/Button';
import { setLoading } from '@/services/app/appSlice';
import { createPostApiThunk, getAllPostsApiThunk } from '@/services/post/postThunk';
import { toast } from 'react-toastify';
import { get } from 'lodash';

const CreatePostModal: FC<CreatePostModalProps> = ({ isOpen, setIsOpen }) => {
    const [imagePreview, setImagePreview] = useState<string[]>([]);

    const userLogin = useAppSelector(selectUserLogin)
    const dispatch = useAppDispatch()

    const initialValues: ActionParamPost = {
        postContent: "",
        images: [],
        posterId: userLogin?.accountId,
        posterName: userLogin?.fullName,
        posterRole: String(userLogin?.roleId),
    };

    const CreatePostModalSchema = Yup.object().shape({
        postContent: Yup.string().required('Nội dung không được để trống').min(10, 'Nội dung phải có ít nhất 10 ký tự'),
    });

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>, setFieldValue: Function) => {
        if (event.target.files) {
            const files = Array.from(event.target.files);
            const base64Promises = files.map(file => convertToBase64(file));

            try {
                const base64Images = await Promise.all(base64Promises);
                setFieldValue("images", base64Images); // 🔹 Lưu danh sách ảnh vào Formik
                setImagePreview(base64Images); // 🔹 Cập nhật ảnh xem trước
            } catch (error) {
                console.error("Error converting images:", error);
            }
        }
    };

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const onSubmit = (values: ActionParamPost, helpers: FormikHelpers<ActionParamPost>) => {
        dispatch(setLoading(true))
        dispatch(createPostApiThunk(values))
            .unwrap()
            .then(() => {
                helpers.resetForm()
                setImagePreview([])
                toast.info("Bài viết của bạn đang chờ được phê duyệt")
                dispatch(getAllPostsApiThunk())
            })
            .catch((error) => {
                const errorData = get(error, "data.message", "An error occurred");
                toast.error(errorData)
            })
            .finally(() => {
                setTimeout(() => {
                    dispatch(setLoading(false))
                }, 1000)
                setIsOpen(false)
            })
    };

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Tạo bài viết">
            <section id="create-post-modal">
                <div className="cpm-container">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={CreatePostModalSchema}
                        onSubmit={onSubmit}
                    >
                        {({ setFieldValue, errors, touched, isSubmitting }) => (
                            <Form className="form">
                                <div className="form-field">
                                    <label className="form-label">Nhập nội dung bài viết</label>
                                    <Field
                                        name="postContent"
                                        as="textarea"
                                        placeholder="Nội dung bài viết"
                                        className={classNames("form-input", { "is-error": errors.postContent && touched.postContent })}
                                    />
                                    {errors.postContent && touched.postContent && <span className="text-error">{errors.postContent}</span>}
                                </div>

                                <div className="form-field">
                                    <label className="form-label">Ảnh</label>
                                    <input type="file" accept="image/*" multiple onChange={(e) => handleFileChange(e, setFieldValue)} className="form-input" />
                                </div>

                                {imagePreview.length > 0 && (
                                    <div className="image-preview-container">
                                        {imagePreview.map((img, index) => (
                                            <img key={index} src={img} alt={`Preview ${index}`} className="image-preview" style={{ width: "100px", height: "100px" }} />
                                        ))}
                                    </div>
                                )}

                                <Button type="submit" title="Đăng bài" loading={isSubmitting} />
                            </Form>
                        )}
                    </Formik>
                </div>
            </section>
        </Modal>
    );
};

export default CreatePostModal;
