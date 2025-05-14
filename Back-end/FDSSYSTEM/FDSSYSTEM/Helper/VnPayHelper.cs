using System.Net;
using System.Security.Cryptography;
using System.Text;

namespace FDSSYSTEM.Helper;

public static class VnPayHelper
{
    public static string CreatePaymentUrl(string baseUrl, string tmnCode, string hashSecret, string returnUrl, string orderId, decimal amount, string bankCode = "")
    {
        var time = DateTime.Now.ToString("yyyyMMddHHmmss");

        var payData = new SortedDictionary<string, string>
        {
        { "vnp_Version", "2.1.0" },
        { "vnp_Command", "pay" },
        { "vnp_TmnCode", tmnCode },
        { "vnp_Amount", ((long)(amount * 100)).ToString() },  // Số tiền cần nhân với 100
        { "vnp_CreateDate", time },
        { "vnp_CurrCode", "VND" },
        { "vnp_IpAddr", "130.0.0.1" },
        { "vnp_Locale", "vn" },
        { "vnp_OrderInfo", $"Thanh toan don hang {orderId}" },
        { "vnp_OrderType", "other" },
        { "vnp_ReturnUrl", returnUrl },
        { "vnp_TxnRef", orderId },
        };

        if (!string.IsNullOrEmpty(bankCode))
        {
            payData.Add("vnp_BankCode", bankCode);
        }

        // Tạo chuỗi ký
        var signData = string.Join("&", payData.Select(x => $"{x.Key}={WebUtility.UrlEncode(x.Value)}"));
        var sign = HmacSHA512(hashSecret, signData);
        payData.Add("vnp_SecureHash", sign);

        // Tạo query string cho URL
        var query = string.Join("&", payData.Select(kv => $"{kv.Key}={WebUtility.UrlEncode(kv.Value)}"));
        return $"{baseUrl}?{query}";
    }

    public static bool ValidateSignature(IQueryCollection query, string hashSecret)
    {
        // Lọc các tham số bắt đầu bằng "vnp_" và loại bỏ chữ ký
        var vnpData = query
            .Where(kv => kv.Key.StartsWith("vnp_") &&
                         kv.Key != "vnp_SecureHash" &&
                         kv.Key != "vnp_SecureHashType")
            .OrderBy(kv => kv.Key)
            .ToDictionary(kv => kv.Key, kv => kv.Value.ToString());

        // Tạo chuỗi rawData với UrlEncode từng giá trị
        var rawData = string.Join("&", vnpData.Select(kv => $"{kv.Key}={WebUtility.UrlEncode(kv.Value)}"));

        // Tính lại hash với secret key
        var computedHash = HmacSHA512(hashSecret, rawData);

        // Lấy hash từ query (do VNPAY gửi)
        var receivedHash = query["vnp_SecureHash"].ToString();

        // So sánh không phân biệt hoa thường
        return string.Equals(computedHash, receivedHash, StringComparison.OrdinalIgnoreCase);
    }

    private static string HmacSHA512(string key, string input)
    {
        using var hmac = new HMACSHA512(Encoding.UTF8.GetBytes(key));
        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(input));
        return BitConverter.ToString(hash).Replace("-", "").ToUpper();
    }
}
