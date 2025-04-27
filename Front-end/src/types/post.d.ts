interface ActionParamPost {
    postId?: string;
    postContent?: string;
    images: string[];
    posterId?: string;
    posterName?: string;
    posterRole?: string;
}

interface PostState {
    listPosts: Post[];
    post: PostInfo | null;
}

interface PostLike {
    postLikeId: string;
    accountId: string;
    fullName: string;
    createdDate: string;
}

// Type for the Comment object
interface PostComment {
    postCommentId: string;
    fullName: string;
    content: string;
    createdDate: string;
    likes: any[]; // You can define a type for likes within comments if needed
    replies: any[] | null; // Assuming replies could be an array or null
}

// Type for the Post object
interface Post {
    postId: string;
    postContent: string;
    images: string[]; // Assuming it's an array of strings for image URLs or paths
    posterId: string;
    posterRole: string;
    posterName: string;
    status: string;
    rejectComment: string | null;
    posterApproverId: string;
    posterApproverName: string;
    publicDate: string;
    likes: PostLike[];
    comments: PostComment[];
}

interface PostInfo {
    postId: string;
    status: string | null;
    createdDate: string; // ISO date string
    images: string[]; // base64 strings
    rejectComment: string | null;
    posterName: string | null;
    postContent: string;
    publicDate: string | null;
    posterId: string | null;
    posterRole: string | null;
    posterApproverId: string | null;
    posterApproverName: string | null;
    likes: PostLike[]; // assuming array of user IDs or names
    comments: PostComment[]; // assuming array of comment IDs or texts (tùy theo hệ thống)
}

interface PostLike {
    accountId: string;
    createdDate: string;
    fullName: string;
}

interface PostComment {
    createdDate: string;
    fullName: string;
    content: string;
}

interface ApprovePost {
    postId: string;
}

interface RejectPost {
    postId: string;
    comment: string;
}

interface CommentPost {
    postId: string | null;
    postCommentId: string | null;
    content: string;
    images: string[];
}

interface PostCommentDto {
    id: string;
    postCommentId: string;
    accountId: string;
    postId: string;
    content: string;
    dateCreated: string;
    dateUpdated: string | null;
    replies: PostCommentDto[] | null;
    images: string[]; // base64 hoặc URL ảnh
}
