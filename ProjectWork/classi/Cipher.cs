namespace ConsoleApp1
{
    public class Cipher
    {
        private int maximum = 65535;

        public string encode(string msg, int shift = -4)
        {
            string finalMessage = "";

            if (shift < 0)
                shift = -shift;

            for (int i = 0; i < msg.Length; i++){
                char letter = msg[i];
                int charInt = (int) letter,
                newInt = charInt + shift;

                if (newInt > this.maximum)
                    newInt = newInt - (this.maximum + 1);

                letter = (char)newInt;

                finalMessage += letter;
            }

            return finalMessage;
        }

        public string decode(string msg, int shift = -4)
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
                    newInt = this.maximum + (newInt + 1);

                letter = (char)newInt;

                finalMessage += letter;
            }

            return finalMessage;
        }
    }
}
