using System;

namespace ProvaQR2
{
    public class Encoder
    {
        const string letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890-";

        public static string encode(string msg, int shift = 4)
        {
            string finalMessage = "";

            if (shift < 0)
                shift = -shift;

            for (int k1 = 0; k1 < msg.Length; k1++)
            {
                string letter = "", v1 = msg[k1].ToString();

                for(int k2 = 0; k2 < letters.Length; k2++)
                {
                    string v2 = letters[k2].ToString();

                    if(v1 == v2)
                    {
                        int index = k2 + shift, lenletters = letters.Length - 1;

                        if (index > lenletters)
                            letter = letters[index - (lenletters + 1)].ToString();
                        else
                            letter = letters[index].ToString();
                    }
                }

                finalMessage += letter;
            }

            return finalMessage;
        }

        public static string decode(string msg, int shift = 4)
        {
            string finalMessage = "";

            if (shift < 0)
                shift = -shift;

            for (int k1 = 0; k1 < msg.Length; k1++)
            {
                string letter = "", v1 = msg[k1].ToString();

                for (int k2 = 0; k2 < letters.Length; k2++)
                {
                    string v2 = letters[k2].ToString();

                    if (v1 == v2)
                    {
                        int index = k2 - shift, lenletters = letters.Length - 1;

                        if (index < 0)
                            letter = letters[lenletters + index + 1].ToString();
                        else
                            letter = letters[index].ToString();
                    }
                }

                finalMessage += letter;
            }

            return finalMessage;
        }
    }
}
