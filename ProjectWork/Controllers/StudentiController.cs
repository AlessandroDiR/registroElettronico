﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectWork.Models;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Cors;
using ProjectWork.classi;
using ProjectWork.CustomizedModels;

namespace ProjectWork.Controllers
{
    [EnableCors("AllowAllHeaders")]
    [Route("api/[controller]")]
    [ApiController]
    public class StudentiController : ControllerBase
    {
        private readonly AvocadoDBContext _context;
        private readonly EmailSender _es;

        public StudentiController(AvocadoDBContext context)
        {
            _context = context;
            _es = new EmailSender();
        }

        // GET: api/Studenti
        [HttpGet]
        public IActionResult GetStudenti()
        {

            var studenti = _context.Studenti;
            var result = new List<object>();

            foreach (var s in studenti)
            {
                var json = new
                {
                    idStudente = s.IdStudente,
                    idCorso = s.IdCorso,
                    nome = s.Nome,
                    cognome = s.Cognome,
                    email = s.Email,
                    dataNascita = s.DataNascita,
                    cf = s.Cf,
                    ritirato = bool.Parse(s.Ritirato),
                    dataRitiro = s.DataRitiro,
                    promosso = bool.Parse(s.Promosso),
                    annoFrequentazione = s.AnnoFrequentazione,
                    giornate = GetDaysAmount(s.IdStudente),
                    frequenza = GetPercentualeFrequenza(s.IdStudente)
                };

                result.Add(json);
            }
            return Ok(result);
        }

        // GET: api/Studenti/1
        [HttpGet("{idCorso}")]
        public IActionResult GetStudenti([FromRoute] int idCorso)
        {
            var studenti = _context.Studenti.Where(s => s.IdCorso == idCorso);
            var result = new List<object>();

            foreach(var s in studenti)
            {
                var json = new
                {
                    idStudente = s.IdStudente,
                    idCorso = s.IdCorso,
                    nome = s.Nome,
                    cognome = s.Cognome,
                    email = s.Email,
                    dataNascita = s.DataNascita,
                    cf = s.Cf,
                    ritirato = bool.Parse(s.Ritirato),
                    dataRitiro = s.DataRitiro,
                    promosso = bool.Parse(s.Promosso),
                    annoFrequentazione = s.AnnoFrequentazione,
                    giornate = GetDaysAmount(s.IdStudente),
                    frequenza = GetPercentualeFrequenza(s.IdStudente)
                };

                result.Add(json);
            }
            return Ok(result);
        }

        // GET: api/Studenti/1/1
        [HttpGet("{idCorso}/{anno}")]
        public IActionResult GetStudenti([FromRoute] int idCorso, int anno)
        {
            var studenti = _context.Studenti.Where(s => s.IdCorso == idCorso && s.AnnoFrequentazione == anno);
            var result = new List<object>();

            foreach (var s in studenti)
            {
                var json = new
                {
                    idStudente = s.IdStudente,
                    idCorso = s.IdCorso,
                    nome = s.Nome,
                    cognome = s.Cognome,
                    email = s.Email,
                    dataNascita = s.DataNascita,
                    cf = s.Cf,
                    ritirato = bool.Parse(s.Ritirato),
                    dataRitiro = s.DataRitiro,
                    promosso = bool.Parse(s.Promosso),
                    annoFrequentazione = s.AnnoFrequentazione,
                    giornate = GetDaysAmount(s.IdStudente),
                    frequenza = GetPercentualeFrequenza(s.IdStudente)
                };

                result.Add(json);
            }
            return Ok(result);
        }


        // GET: api/Studenti/GetStudentiById/5
        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> GetStudentiById([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var s = await _context.Studenti.FindAsync(id);

            if (s == null)
            {
                return NotFound();
            }

            var json = new
            {
                idStudente = s.IdStudente,
                idCorso = s.IdCorso,
                nome = s.Nome,
                cognome = s.Cognome,
                email = s.Email,
                dataNascita = s.DataNascita,
                cf = s.Cf,
                codice = s.Codice,
                ritirato = bool.Parse(s.Ritirato),
                dataRitiro = s.DataRitiro,
                promosso = bool.Parse(s.Promosso),
                annoFrequentazione = s.AnnoFrequentazione,
                giornate = GetDaysAmount(s.IdStudente),
                frequenza = GetPercentualeFrequenza(s.IdStudente)
            };

            return Ok(json);
        }

        [HttpGet("[action]/{idStudente}")]
        public async Task<IActionResult> GetHoursAmount([FromRoute] int idStudente)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var studente = await _context.Studenti.SingleOrDefaultAsync(s => s.IdStudente == idStudente);

            if (studente == null)
            {
                return NotFound();
            }

            var hoursAmount = HoursAmount(idStudente);

            return Ok(hoursAmount);
        }

        [HttpGet("[action]/{idStudente}")]
        public IActionResult GetDetailedPresences([FromRoute] int idStudente)
        {
            var presences = _context.Presenze.Where(p => p.IdStudente == idStudente);

            if(presences == null)
            {
                return RedirectToAction("GetStudenti");
            }

            var result = new List<object>();
            foreach(var p in presences)
            {
                if (p.IdLezioneNavigation == null)
                    p.IdLezioneNavigation = _context.Lezioni.FirstOrDefault(l => l.IdLezione == p.IdLezione);

                var json = new
                {
                    idPresenza = p.IdPresenza,
                    idStudente = p.IdStudente,
                    data = _context.Lezioni.FirstOrDefault(l => l.IdLezione == p.IdLezioneNavigation.IdLezione).Data,
                    idLezione = _context.Lezioni.FirstOrDefault(l => l.IdLezione == p.IdLezioneNavigation.IdLezione).IdLezione,
                    lezione = _context.Lezioni.FirstOrDefault(l => l.IdLezione == p.IdLezioneNavigation.IdLezione).Titolo,
                    ingresso = DateTime.UtcNow.Date.Add(p.Ingresso),
                    uscita = DateTime.UtcNow.Date.Add(p.Uscita)
                };
                result.Add(json);
            }
            return Ok(result);
        }

        [HttpGet("[action]/{idStudente}")]
        public double GetTotaleOreLezioni([FromRoute] int idStudente)
        {
            return TotaleOreLezioni(idStudente);
        }

        //Crea studente
        // POST: api/Studenti
        [HttpPost]
        public async Task<IActionResult> PostStudenti([FromBody] PostStudentiModel obj)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var coordinatore = await _context.Coordinatori.SingleOrDefaultAsync(c => c.IdCoordinatore == obj.AuthCoordinatore.IdCoordinatore && c.Password == obj.AuthCoordinatore.Password);
            if (coordinatore == null)
                return NotFound();

            var idCorso = obj.Studenti[0].IdCorso;

            foreach(var s in obj.Studenti)
            {
                Studenti studente = new Studenti
                {
                    Nome = s.Nome,
                    Cognome = s.Cognome,
                    Cf = s.Cf,
                    Email = s.Email,
                    DataNascita = s.DataNascita,
                    AnnoFrequentazione = s.AnnoFrequentazione,
                    IdCorso = s.IdCorso,
                    Password = Cipher.encode(s.Cf),
                    Codice = Cipher.encode(s.Cf)
                };

                _context.Studenti.Add(studente);
                _es.SendCredenzialiStudente(studente);
            }

            await _context.SaveChangesAsync();

            return GetStudenti(idCorso);
        }

        // PUT: api/Studenti/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStudenti([FromRoute] int id, [FromBody] PutStudenteModel obj)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var coordinatore = _context.Coordinatori.SingleOrDefault(c => c.IdCoordinatore == obj.AuthCoordinatore.IdCoordinatore && c.Password == obj.AuthCoordinatore.Password);
            if (coordinatore == null)
                return NotFound();

            if (id != obj.Studente.IdStudente)
            {
                return BadRequest();
            }

            var s = await _context.Studenti.SingleOrDefaultAsync(i => i.IdStudente == id);

            if (obj.Studente.Password == null)
                obj.Studente.Password = s.Password;

            if (obj.Studente.Codice == null)
                obj.Studente.Codice = s.Codice;

            _context.Remove(s);
            _context.Entry(obj.Studente).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StudentiExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            var json = new
            {
                idStudente = obj.Studente.IdStudente,
                idCorso = obj.Studente.IdCorso,
                nome = obj.Studente.Nome,
                cognome = obj.Studente.Cognome,
                email = obj.Studente.Email,
                dataNascita = obj.Studente.DataNascita,
                cf = obj.Studente.Cf,
                ritirato = bool.Parse(obj.Studente.Ritirato),
                dataRitiro = obj.Studente.DataRitiro,
                promosso = bool.Parse(s.Promosso),
                annoFrequentazione = obj.Studente.AnnoFrequentazione,
                giornate = GetDaysAmount(obj.Studente.IdStudente),
                frequenza = GetPercentualeFrequenza(obj.Studente.IdStudente)
            };

            return Ok(json);
        }

        // PUT: api/Studenti
        [HttpPut]
        public IActionResult PutStudentiArray([FromBody] PostStudentiModel obj)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var coordinatore = _context.Coordinatori.SingleOrDefault(c => c.IdCoordinatore == obj.AuthCoordinatore.IdCoordinatore && c.Password == obj.AuthCoordinatore.Password);
            if (coordinatore == null)
                return NotFound();

            var idCorso = obj.Studenti[0].IdCorso;

            foreach (var item in obj.Studenti)
            {
                try
                {
                    var s = _context.Studenti.Find(item.IdStudente);

                    if (item.Password == null)
                        item.Password = s.Password;

                    if (item.Codice == null)
                        item.Codice = s.Codice;

                    _context.Remove(s);
                    _context.Entry(item).State = EntityState.Modified;
                }
                catch
                {
                    if (!StudentiExists(item.IdStudente))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
            }
            _context.SaveChanges();
            return GetStudenti(idCorso);
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> PromuoviStudente([FromBody]  PromozioneModel promozione)
        {
            var coordinatore = await _context.Coordinatori.SingleOrDefaultAsync(c => c.IdCoordinatore == promozione.AuthCoordinatore.IdCoordinatore && c.Password == promozione.AuthCoordinatore.Password);

            if (coordinatore == null)
                return NotFound();

            var studente = _context.Studenti.FirstOrDefault(s => s.IdStudente == promozione.IdStudente);

            if (studente == null)
            {
                return NotFound("Studente non esistente");      
            }
            else
            {
                studente.Promosso = "true";
            }

            _context.Studenti.Update(studente);
            await _context.SaveChangesAsync();

            return GetStudenti(studente.IdCorso);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> LoginStudente([FromBody] StudentCred cred)
        {
            var st = await _context.Studenti.SingleOrDefaultAsync(s => s.Email == cred.Email && s.Password == cred.Password);

            if (st == null)
                return Ok("Studente inesistente");

            if (st.Promosso == "true" || st.Ritirato == "true")
            {
                return Ok("Accesso negato. Non frequenti più il corso.");
            }

            var json = new
            {
                idStudente = st.IdStudente,
                nome = st.Nome,
                cognome = st.Cognome,
                password = st.Password,
                idCorso = st.IdCorso,
                annoFrequentazione = st.AnnoFrequentazione,
                codice = st.Codice
            };

            return Ok(json);
        }

        // POST: api/Studente/RecuperoPwdStudente
        [HttpPost("[action]")]
        public async Task<IActionResult> RecuperoPwdStudente([FromBody] StudentEmail obj)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var studente = _context.Studenti.FirstOrDefault(s => obj.Email == s.Email);

            if (studente == null)
            {
                return Ok("error");
            }

            int Codice = int.Parse(DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString().Substring(5, 5));

            string subject = "FITSTIC | Recupero Password";
            string body = $"Ciao! Ecco il codice che dovrai inserire per recuperare la password: <strong>{Codice}</strong>. Il codice ha una durata di 5 minuti.";

            EmailSender es = new EmailSender();
            if (es.SendEmailTo(obj.Email, subject, body) == "success")
            {
                RecPwdStudente rec = new RecPwdStudente
                {
                    IdStudente = studente.IdStudente,
                    DataRichiesta = DateTime.UtcNow.ToLocalTime(),
                    Codice = Codice
                };
                _context.RecPwdStudente.Add(rec);
                await _context.SaveChangesAsync();
            }
            else
            {
                return BadRequest("Impossibile inviare la mail");
            }


            return Ok(studente.IdStudente);
        }

        // POST: api/Studenti/CambioPassword
        [HttpPost("[action]")]
        public async Task<IActionResult> CambioPassword([FromBody] RecPwd_UtenteDati obj)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var rec = _context.RecPwdStudente.LastOrDefault(s => obj.IdUtente == s.IdStudente);

            if (rec == null)
            {
                return NotFound("Studente non trovato");
            }

            if (rec.Codice != obj.Codice)
            {
                return Ok("Codice errato");
            }
            else if (rec.DataRichiesta.AddMinutes(5) < DateTime.UtcNow.ToLocalTime())
            {
                return Ok("Codice non più valido");
            }

            var studente = _context.Studenti.FirstOrDefault(s => obj.IdUtente == s.IdStudente);
            if (studente == null)
            {
                return NotFound("studente non trovato");
            }

            studente.Password = obj.Password;

            _context.Entry(studente).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StudentiExists(studente.IdStudente))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok("success");
        }

        [HttpGet("[action]/{idStudente}")]
        public IActionResult GetOreStage([FromRoute] int idStudente)
        {
            var stage = _context.Stage.Where(s => s.IdStudente == idStudente);
            var result = new List<object>();

            foreach(var s in stage)
            {
                var json = new
                {
                    data = s.Data,
                    oraInizio = s.OraInizio,
                    oraFine = s.OraFine,
                    argomento = s.Argomento,
                    totaleRelativo = Math.Abs((s.OraFine.TimeOfDay - s.OraInizio.TimeOfDay).TotalHours)
                };

                result.Add(json);
            }

            return Ok(result);
        }

        [HttpPost("[action]/{idStudente}")]
        public async Task<IActionResult> PostOreStage([FromRoute] int idStudente, [FromBody] PostOreStage obj)
        {
            var studente = await _context.Studenti.SingleOrDefaultAsync(s => s.IdStudente == idStudente && s.Password == obj.Password);
            var oreDaInserire = (obj.OraFine - obj.OraInizio).TotalHours;

            if (studente == null)
            {
                var json = new
                {
                    type = "error",
                    message = "Lo studente è inesistente."
                };

                return Ok(json);
            }

            var oreTotali = TotaleOrestage(idStudente);

            if (obj.OraFine < obj.OraInizio)
            {
                var json = new
                {
                    type = "error",
                    message = "L'orario di fine non può essere minore dell'orario di inizio."
                };

                return Ok(json);
            }

            if(oreTotali == 800)
            {
                var json = new
                {
                    type = "error",
                    message = "Hai già registrato un massimo di 800 ore."
                };

                return Ok(json);
            }

            if(oreTotali + oreDaInserire > 800)
            {
                var json = new
                {
                    type = "error",
                    message = "Non puoi registrare più di 800 ore."
                };

                return Ok(json);
            }

            if (CheckOreStagePerDay(idStudente, obj.Data))
            {
                var json = new
                {
                    type = "error",
                    message = "Hai già registrato un massimo di 8 ore per la data selezionata."
                };

                return Ok(json);
            }

            if(oreDaInserire >= 8)
            {
                var json = new
                {
                    type = "error",
                    message = "Non puoi inserire 8 o più ore di lavoro consecutive."
                };

                return Ok(json);
            }

            if (CheckOreSvolteConOreInseritePerDay(idStudente, obj.Data, oreDaInserire))
            {
                var json = new
                {
                    type = "error",
                    message = "Non puoi inserire più di 8 ore di lavoro giornaliere."
                };

                return Ok(json);
            }


            var nuovaIstanzaStage = new Stage
            {
                IdStudente = idStudente,
                Data = obj.Data,
                OraInizio = obj.OraInizio,
                OraFine = obj.OraFine,
                Argomento = obj.Argomento
            };

            _context.Stage.Add(nuovaIstanzaStage);
            _context.SaveChanges();

            var result = new
            {
                type = "success",
                message = "Inserimento avvenuto correttamente"
            };

            return Ok(result);

        }

        private bool CheckOreStagePerDay(int idStudente, DateTime oggi)
        {
            var istanzeStage = _context.Stage.Where(s => s.IdStudente == idStudente && s.Data == oggi);
            if (istanzeStage.Count() == 0)
                return false;
            TimeSpan sommaOreSvolte = new TimeSpan();
            foreach(var i in istanzeStage)
            {
                sommaOreSvolte += i.OraFine.TimeOfDay - i.OraInizio.TimeOfDay;
            }

            return sommaOreSvolte.TotalHours == 8;
        }

        private bool CheckOreSvolteConOreInseritePerDay(int idStudente, DateTime oggi, double oreDaInserire)
        {
            var istanzeGiornaliere = _context.Stage.Where(s => s.IdStudente == idStudente && s.Data == oggi);
            if (istanzeGiornaliere.Count() == 0)
                return false;
            TimeSpan sommaOreSvolte = new TimeSpan();
            foreach (var i in istanzeGiornaliere)
            {
                sommaOreSvolte += i.OraFine.TimeOfDay - i.OraInizio.TimeOfDay;
            }

            return sommaOreSvolte.TotalHours + oreDaInserire > 8;
        }

        private double TotaleOrestage(int idStudente)
        {
            var stage = _context.Stage.Where(s => s.IdStudente == idStudente);
            var oreTotali = 0.0;
            foreach(var s in stage)
            {
                oreTotali += Math.Abs((s.OraFine.TimeOfDay - s.OraInizio.TimeOfDay).TotalHours);
            }

            return oreTotali;
        }



        private bool StudentiExists(int id)
        {
            return _context.Studenti.Any(e => e.IdStudente == id);
        }

        public int GetDaysAmount(int idStudente)
        {
            var studente = _context.Studenti.SingleOrDefault(s => s.IdStudente == idStudente);

            var getPresenze = _context.Presenze.Where(p => p.IdStudente == idStudente);
            foreach (var day in getPresenze)
            {
                if (day.IdLezioneNavigation == null)
                    day.IdLezioneNavigation = _context.Lezioni.FirstOrDefault(l => l.IdLezione == day.IdLezione);
            }

            var daysAmount = getPresenze.GroupBy(p => p.IdLezioneNavigation.Data);

            return daysAmount.Count();
        }

        public double GetPercentualeFrequenza(int idStudente)
        {
            // la percentuale viene calcolata in relazione alle ore di lezione svolte ed alle ore di presenza effettive dello studente
            var totOreLezioni = TotaleOreLezioni(idStudente);

            var oreEffettiveStudente = HoursAmount(idStudente);

            var percentualePresenza = oreEffettiveStudente * 100 / totOreLezioni;

            return Math.Round(percentualePresenza, 0);
        }

        public double HoursAmount(int idStudente)
        {
            var presenzeTotali = _context.Presenze.Where(p => p.IdStudente == idStudente && p.Uscita != new TimeSpan(0,0,0));
            TimeSpan hoursAmount = new TimeSpan();

            foreach (var p in presenzeTotali)
            {
                var dailyHours = p.Uscita - p.Ingresso;
                if (dailyHours != null)
                {
                    hoursAmount += dailyHours;
                }
            }

            var studente = _context.Studenti.Find(idStudente);
            if (studente.Promosso == "true" || studente.AnnoFrequentazione == 2)
                return _context.Stage.Where(s => s.IdStudente == idStudente).Sum(s => s.OraFine.TimeOfDay.TotalHours - s.OraInizio.TimeOfDay.TotalHours) + Math.Round(hoursAmount.TotalHours, 2);

            return Math.Round(hoursAmount.TotalHours, 2);
        }

        public double TotaleOreLezioni(int idStudente)
        {
            var studente = _context.Studenti.Find(idStudente);
            var corso = _context.Corsi.Find(studente.IdCorso);

            if (studente.Promosso == "true")
                return 2000;


            var calendario = _context.Calendari.SingleOrDefault(c => c.IdCorso == studente.IdCorso && c.Anno == studente.AnnoFrequentazione);

            if (calendario == null && studente.AnnoFrequentazione == 2 && corso.StageSecondoAnno)
                return 800;
            if (calendario == null && studente.AnnoFrequentazione == 2 && !corso.StageSecondoAnno)
                return 400;
            if (calendario == null && studente.AnnoFrequentazione == 1 && corso.StagePrimoAnno)
                return 400;
            if (calendario == null && studente.AnnoFrequentazione == 1 && !corso.StagePrimoAnno)
                return 0;

            var lezioni = _context.Lezioni.Where(l => l.IdCalendario == calendario.IdCalendario && l.Data <= DateTime.UtcNow);
            TimeSpan totOreLezioni = new TimeSpan();

            foreach (var l in lezioni)
            {
                totOreLezioni += l.OraFine - l.OraInizio;
            }

            if (studente.AnnoFrequentazione == 1 && corso.StagePrimoAnno)
                return totOreLezioni.TotalHours + 400;
            if (studente.AnnoFrequentazione == 2 && corso.StageSecondoAnno)
                return totOreLezioni.TotalHours + 800;

            return totOreLezioni.TotalHours;
        }
    }
}