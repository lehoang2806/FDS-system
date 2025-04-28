interface PostContentProps {
    content: string;
}

const PostContent: React.FC<PostContentProps> = ({ content }) => {
    return (
        <div
            className="pcr2-content"
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
};

export default PostContent;