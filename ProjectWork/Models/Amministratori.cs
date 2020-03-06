using System;
using System.Collections.Generic;

namespace ProjectWork.Models
{
    public partial class Amministratori
    {
        public int IdAmministratore { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Nome { get; set; }
        public string Cognome { get; set; }
    }
}
