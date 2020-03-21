using ProjectWork.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectWork.CustomizedModels
{
    public class PutPresenzeModel
    {
        public AuthCoordinatoreModel AuthCoordinatore { get; set; }
        public Presenze Presenza { get; set; }
    }
}
