import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase.ts"; // Đảm bảo bạn đã cấu hình firebase đúng

// Hàm upload ảnh và trả về URL
const uploadImage = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `images/${file.name}`);  // Tạo ref cho ảnh

    // Tải ảnh lên Firebase Storage
    await uploadBytes(storageRef, file);

    // Lấy URL của ảnh đã tải lên
    const url = await getDownloadURL(storageRef);

    return url;  // Trả về URL dưới dạng string
};

export default uploadImage;
