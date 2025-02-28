
using FDSSYSTEM.Database;
using FDSSYSTEM.Models;

namespace FDSSYSTEM.Repositories.UserRepository;

public interface IUserRepository:IMongoRepository<Account>
{
    //#region HUY - LOGIN/REGISTER/FORGOR PASSWORD/GETINFO/UPDATE USER/ CHANGE PASSWORD
    //object Login(string email, string password, IConfiguration config);
    //object Register(Register register);
    //Task<object> ForgotPassword(string email);
    //Task<object> GetInfo(string token);
    //object UpdateUser(UpdateUser user);
    //object LoginByGoogle(Register register, IConfiguration config);
    //Task<object> ChangePassword(int accountId, string newPassword);
    //object ChangeAvatar(int accountId, string newAvatar);

    //public Task<object> SearchInforByEmail(string email);
    //#endregion

    //#region - MANAGE USER
    //public object GetAllAccountUser();
    //public object UpdateAccountUser(AccountDTO user);
    //public object GetAccountUserById();
    //object ChangeStatusUser(int accountId, string status);

    //object WeekLyActivity(int accountId);
    //public object GetPhoneNumberWithoutThisPhone(string phoneNumber);

   // #endregion
}