﻿namespace FDSSYSTEM.DTOs
{
    public class PostResponseDto
    {
        public string PostContent { get; set; }
        public List<string> Images { get; set; }
        public string PosterId { get; set; }
        public string PosterRole { get; set; }
        public string PosterName { get; set; }

        public string Status { get; set; }   // Trạng thái bài viết
        public string RejectComment { get; set; }  // Lý do từ chối (nếu có)
    }
}
