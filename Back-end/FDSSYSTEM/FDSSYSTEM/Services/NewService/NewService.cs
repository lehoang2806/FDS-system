using FDSSYSTEM.Database;
using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.NewRepository;
using FDSSYSTEM.Repositories.PostRepository;
using FDSSYSTEM.Services.PostService;
using Microsoft.Extensions.Hosting;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace FDSSYSTEM.Services.NewService
{
    public class NewService : INewService
    {
        private readonly INewRepository _newRepository;
        private object _newsCollection;

        public NewService(INewRepository newRepository)
        {
            _newRepository = newRepository;
        }



        public async Task Create(NewDto newDto)
        {
            await _newRepository.AddAsync(new New
            {
                Title = newDto.Title,
                DateStart = newDto.DateStart,
                DateEnd = newDto.DateEnd,
                DateCreated = DateTime.Now,
                Image = newDto.Image,
                NewId = Guid.NewGuid().ToString(),
                Content = newDto.Content,
                Status = "Pending"

            });
        }

        public async Task Delete(string id)
        {
            var filter = Builders<New>.Filter.Eq(news => news.NewId, id);
            await _newRepository.DeleteAsync(filter);
        }

       

        public async Task<New> GetById(string id)
        {
            return await _newRepository.GetByIdAsync(id);
        }



        // Update an existing news post
        public async Task Update(string id, NewDto newDto)
        {
            var news = await _newRepository.GetByIdAsync(id);
            news.Title = newDto.Title;
            news.Image = newDto.Image;
            news.Content = newDto.Content;
            news.DateStart = newDto.DateStart;
            news.DateEnd = newDto.DateEnd;

            await _newRepository.UpdateAsync(news.Id, news);

        }

        public async Task Approve(ApproveNewDto approveNewDto)
        {
            var filter = Builders<New>.Filter.Eq(c => c.NewId, approveNewDto.NewId);
            var news = (await _newRepository.GetAllAsync(filter)).FirstOrDefault();

            news.Status = "Approved";
            await _newRepository.UpdateAsync(news.Id, news);
        }

        public async Task Reject(RejectNewDto rejectNewDto)
        {
            var filter = Builders<New>.Filter.Eq(c => c.NewId, rejectNewDto.NewId);
            var news = (await _newRepository.GetAllAsync(filter)).FirstOrDefault();

            news.Status = "Rejected";
            news.RejectComment = rejectNewDto.Comment;
            await _newRepository.UpdateAsync(news.Id, news);
        }

     
        public async Task<List<New>> GetAllNewsApproved()
        {
            var filter = Builders<New>.Filter.Eq(news => news.Status, "Approved");
            return (await _newRepository.GetAllAsync(filter)).ToList();
        }

        public async Task<List<New>> GetAllNewsPending()
        {
            var filter = Builders<New>.Filter.Eq(news => news.Status, "Pending");
            return (await _newRepository.GetAllAsync(filter)).ToList();
        }

        public async Task<List<New>> GetAllNews()
        {
            return (await _newRepository.GetAllAsync()).ToList();
        }

    }
}

