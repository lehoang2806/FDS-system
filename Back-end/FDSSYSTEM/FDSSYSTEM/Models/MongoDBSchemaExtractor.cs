using MongoDB.Driver;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

public class MongoDBSchemaExtractor
{
    private readonly IMongoDatabase _database;

    public MongoDBSchemaExtractor(string databaseName)
    {
        var client = new MongoClient("mongodb://localhost:27017");
        _database = client.GetDatabase(databaseName);
    }

    public void GenerateModels(string outputPath)
    {
        var collections = _database.ListCollectionNames().ToList();

        foreach (var collectionName in collections)
        {
            var collection = _database.GetCollection<BsonDocument>(collectionName);
            var sampleDocument = collection.Find(new BsonDocument()).FirstOrDefault();

            if (sampleDocument != null)
            {
                GenerateModelClass(collectionName, sampleDocument, outputPath);
            }
        }
    }

    private void GenerateModelClass(string collectionName, BsonDocument sampleDocument, string outputPath)
    {
        StringBuilder classBuilder = new StringBuilder();
        classBuilder.AppendLine("using MongoDB.Bson;");
        classBuilder.AppendLine("using MongoDB.Bson.Serialization.Attributes;");
        classBuilder.AppendLine("using System;");
        classBuilder.AppendLine();
        classBuilder.AppendLine($"public class {collectionName}");
        classBuilder.AppendLine("{");

        foreach (var element in sampleDocument.Elements)
        {
            string propertyType = GetCSharpType(element.Value);
            string propertyName = element.Name;
            classBuilder.AppendLine($"    [BsonElement(\"{propertyName}\")]");
            classBuilder.AppendLine($"    public {propertyType} {propertyName} {{ get; set; }}");
            classBuilder.AppendLine();
        }

        classBuilder.AppendLine("}");

        File.WriteAllText(Path.Combine(outputPath, $"{collectionName}.cs"), classBuilder.ToString());
        Console.WriteLine($"Generated: {collectionName}.cs");
    }

    private string GetCSharpType(BsonValue bsonValue)
    {
        return bsonValue.BsonType switch
        {
            BsonType.ObjectId => "string",
            BsonType.Int32 => "int",
            BsonType.Int64 => "long",
            BsonType.Double => "double",
            BsonType.Boolean => "bool",
            BsonType.DateTime => "DateTime",
            BsonType.String => "string",
            BsonType.Array => "List<object>",
            BsonType.Document => "object",
            _ => "object"
        };
    }
}
