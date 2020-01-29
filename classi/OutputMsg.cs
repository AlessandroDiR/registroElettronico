namespace ProvaQR2
{
    public class OutputMsg
    {
        public static string generateMessage(string title, string message, bool error = false)
        {
            if (error)
                return @"{
                    ""title"": title,
                    ""message"": message,
                    ""icon"": ""fa-times-circle"",
                    ""iconColor"": ""#de1e30"",
                    ""time"": 2500
                }";

            return @"{
                ""title"": title,
                ""message"": message,
                ""icon"": ""fa-check-circle"",
                ""iconColor"": ""#25ad25"",
                ""time"": 1200
            }";
        }
    }
}
