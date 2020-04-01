using ProjectWork.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectWork.CustomizedModels
{
    public class StudentiLezioneModel
    {
        public Lezioni Lezione { get; set; }
        public List<Studenti> Studenti { get; set; }
    }
}
