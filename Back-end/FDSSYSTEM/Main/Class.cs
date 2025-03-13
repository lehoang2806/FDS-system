namespace FDSSYSTEM.Main
{
    class Program
    {
        static void Main()
        {
            MongoDBSchemaExtractor extractor = new MongoDBSchemaExtractor("FDSSystem");
            extractor.GenerateModels(@"D:\Backend1\FDSSYSTEM\FDSSYSTEM\Models"); // Đặt đường dẫn nơi lưu các file Model
            Console.WriteLine("Tạo Model hoàn tất!");
        }
    }
}