using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FDSSYSTEM.Models
{
    public class MongoHelper
    {
       public static IMongoClient client { get; set; } 
       public static IMongoDatabase database { get; set; }
       public static string MongoConnection = "localhost:27017";
       public static string MongoDatabase = "FDSSystem";

       public static IMongoCollection<Models.Account> accounts_collection { get; set; }
        internal static void ConnectToMongoService()
        {
            try
            {
                client = new MongoClient(MongoConnection);
                database = client.GetDatabase(MongoDatabase);
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
