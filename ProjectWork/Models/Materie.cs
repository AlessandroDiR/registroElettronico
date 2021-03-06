﻿using System;
using System.Collections.Generic;

namespace ProjectWork.Models
{
    public partial class Materie
    {
        public Materie()
        {
            Comprende = new HashSet<Comprende>();
            Insegnare = new HashSet<Insegnare>();
            Lezioni = new HashSet<Lezioni>();
        }

        public int IdMateria { get; set; }
        public string Nome { get; set; }

        public ICollection<Comprende> Comprende { get; set; }
        public ICollection<Insegnare> Insegnare { get; set; }
        public ICollection<Lezioni> Lezioni { get; set; }
    }
}
