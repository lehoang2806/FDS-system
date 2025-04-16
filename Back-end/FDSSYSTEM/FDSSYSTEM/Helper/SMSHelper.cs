using FDSSYSTEM.Options;
using Microsoft.Extensions.Options;
using MimeKit;
using Twilio.Types;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using NuGet.Protocol.Plugins;

namespace FDSSYSTEM.Helper
{
    public class SMSHelper
    {
        private readonly SmsTwilioSetting _smsSetting;

        public SMSHelper(IOptions<SmsTwilioSetting> smsSetting)
        {
            _smsSetting = smsSetting.Value;
            TwilioClient.Init(_smsSetting.AccountId, _smsSetting.Token);
        }

        public void SendSMS(string ToNumber, string body)
        {

            if (!string.IsNullOrEmpty(_smsSetting.FromNumber))
            {
                if (ToNumber.StartsWith("0"))
                {
                    ToNumber = "+84" + ToNumber.Substring(1);
                }

                Task.Run(() =>
                {
                    try
                    {
                        var message = MessageResource.Create(
                         to: new PhoneNumber(ToNumber),
                         from: new PhoneNumber(_smsSetting.FromNumber),
                         body: body
                    );
                    }
                    catch
                    {

                    }
                });
            }
        }
    }
}
