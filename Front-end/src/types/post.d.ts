interface ActionParamPost {
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

interface Post {
    postContent: string;
    images: string[];
    posterId: string;
    posterRole: string;
    posterName: string;
    status: string;
    rejectComment: string | null;
    posterApproverId: string | null;
    posterApproverName: string | null;
    postId: string;
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
    likes: string[]; // assuming array of user IDs or names
    comments: string[]; // assuming array of comment IDs or texts (tùy theo hệ thống)
}
