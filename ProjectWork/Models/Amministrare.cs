using System;
using System.Collections.Generic;

namespace ProjectWork.Models
{
    public partial class Amministrare
    {
        public int IdAdmin { get; set; }
        public int IdCorso { get; set; }

        public Amministratori IdAdminNavigation { get; set; }
        public Corsi IdCorsoNavigation { get; set; }
    }
}
