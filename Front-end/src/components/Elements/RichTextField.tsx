import { useField } from 'formik';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextFieldProps {
  name: string;
  placeholder?: string;
}

const RichTextField: React.FC<RichTextFieldProps> = ({ name, placeholder }) => {
  const [field, meta, helpers] = useField(name);

  return (
    <div>
      <ReactQuill
        value={field.value}
        onChange={(value) => helpers.setValue(value)}
        placeholder={placeholder}
        onBlur={() => helpers.setTouched(true)}
        style={{
            height: '200px',           // Chiều cao editor (cho nhiều dòng)
            marginBottom: '80px',      // Khoảng cách với phần dưới
          }}
      />
      {meta.touched && meta.error ? (
        <div className='text-error'>{meta.error}</div>
      ) : null}
    </div>
  );
};

export default RichTextField;
