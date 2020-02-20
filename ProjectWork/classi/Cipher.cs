namespace ProjectWork
{
    public class Cipher
    {
        static public int maximum = 65535;

        static public string encode(string msg, int shift = -4)
        {
            string finalMessage = "";

            if (shift < 0)
                shift = -shift;

            for (int i = 0; i < msg.Length; i++){
                char letter = msg[i];
                int charInt = (int) letter,
                newInt = charInt + shift;

                if (newInt > maximum)
                    newInt = newInt - (maximum + 1);

                letter = (char)newInt;

                finalMessage += letter;
            }

            return finalMessage;
        }

        static public string decode(string msg, int shift = -4)
        {
            string finalMessage = "";

            if (shift < 0)
                shift = -shift;

            for (int i = 0; i < msg.Length; i++)
            {
                char letter = msg[i];
                int charInt = (int)letter,
                newInt = charInt - shift;

                if (newInt < 0)
                    newInt = maximum + (newInt + 1);

                letter = (char)newInt;

                finalMessage += letter;
            }

            return finalMessage;
        }
    }
}
