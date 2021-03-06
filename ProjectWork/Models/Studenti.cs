﻿using System;
using System.Collections.Generic;

namespace ProjectWork.Models
{
    public partial class Studenti
    {
        public Studenti()
        {
            Presenze = new HashSet<Presenze>();
            RecPwdStudente = new HashSet<RecPwdStudente>();
            Stage = new HashSet<Stage>();
        }

        public int IdStudente { get; set; }
        public string Nome { get; set; }
        public string Cognome { get; set; }
        public string Codice { get; set; }
        public string Password { get; set; }
        public string Cf { get; set; }
        public string Email { get; set; }
        public DateTime DataNascita { get; set; }
        public int AnnoFrequentazione { get; set; }
        public int IdCorso { get; set; }
        public string Ritirato { get; set; }
        public DateTime? DataRitiro { get; set; }
        public string Promosso { get; set; }

        public Corsi IdCorsoNavigation { get; set; }
        public ICollection<Presenze> Presenze { get; set; }
        public ICollection<RecPwdStudente> RecPwdStudente { get; set; }
        public ICollection<Stage> Stage { get; set; }
    }
}
