interface ActionParamPost {
    postContent?: string;
    images: string[];
    posterId?: string;
    posterName?: string;
    posterRole?: string;
}

interface PostState {
    listPosts: Post[];
}

interface Post {
    postContent: string;
    images: string[];
    posterId: string;
    posterName: string;
    posterRole: string;
    status: string;
    rejectComment: string | null;
    posterApproverId: string | null;
    posterApproverName: string | null;
}