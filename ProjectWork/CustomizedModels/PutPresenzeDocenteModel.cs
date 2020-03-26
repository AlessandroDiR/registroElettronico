using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProjectWork.Models;

namespace ProjectWork.CustomizedModels
{
    public class PutPresenzeDocenteModel
    {
        public AuthCoordinatoreModel AuthCoordinatore { get; set; }
        public PresenzeDocente Presenza { get; set; }
    }
}
