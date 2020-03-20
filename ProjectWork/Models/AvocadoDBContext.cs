using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace ProjectWork.Models
{
    public partial class AvocadoDBContext : DbContext
    {
        public AvocadoDBContext()
        {
        }

        public AvocadoDBContext(DbContextOptions<AvocadoDBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Amministratori> Amministratori { get; set; }
        public virtual DbSet<Calendari> Calendari { get; set; }
        public virtual DbSet<Comprende> Comprende { get; set; }
        public virtual DbSet<Coordina> Coordina { get; set; }
        public virtual DbSet<Coordinatori> Coordinatori { get; set; }
        public virtual DbSet<Corsi> Corsi { get; set; }
        public virtual DbSet<Docenti> Docenti { get; set; }
        public virtual DbSet<Insegnare> Insegnare { get; set; }
        public virtual DbSet<Lezioni> Lezioni { get; set; }
        public virtual DbSet<LogPresenze> LogPresenze { get; set; }
        public virtual DbSet<Materie> Materie { get; set; }
        public virtual DbSet<Presenze> Presenze { get; set; }
        public virtual DbSet<PresenzeDocente> PresenzeDocente { get; set; }
        public virtual DbSet<Studenti> Studenti { get; set; }
        public virtual DbSet<Tenere> Tenere { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Server=dell-alessandro\\dell_alessandro;Database=AvocadoDB;Trusted_Connection=True;");
            }

            optionsBuilder.EnableSensitiveDataLogging();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Amministratori>(entity =>
            {
                entity.HasKey(e => e.IdAmministratore);

                entity.Property(e => e.IdAmministratore).HasColumnName("id_amministratore");

                entity.Property(e => e.Cognome)
                    .HasColumnName("cognome")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Nome)
                    .HasColumnName("nome")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasColumnName("password")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Username)
                    .IsRequired()
                    .HasColumnName("username")
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Calendari>(entity =>
            {
                entity.HasKey(e => e.IdCalendario);

                entity.Property(e => e.IdCalendario)
                    .HasColumnName("id_calendario")
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .ValueGeneratedNever();

                entity.Property(e => e.Anno).HasColumnName("anno");

                entity.Property(e => e.IdCorso).HasColumnName("id_corso");

                entity.Property(e => e.IdGoogleCalendar)
                    .IsRequired()
                    .HasColumnName("id_google_calendar")
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.NextSyncToken)
                    .HasColumnName("nextSyncToken")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.HasOne(d => d.IdCorsoNavigation)
                    .WithMany(p => p.Calendari)
                    .HasForeignKey(d => d.IdCorso)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Calendari_Corsi");
            });

            modelBuilder.Entity<Comprende>(entity =>
            {
                entity.HasKey(e => new { e.IdMateria, e.IdCorso });

                entity.Property(e => e.IdMateria).HasColumnName("id_materia");

                entity.Property(e => e.IdCorso).HasColumnName("id_corso");

                entity.HasOne(d => d.IdCorsoNavigation)
                    .WithMany(p => p.Comprende)
                    .HasForeignKey(d => d.IdCorso)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Comprendere_Corsi");

                entity.HasOne(d => d.IdMateriaNavigation)
                    .WithMany(p => p.Comprende)
                    .HasForeignKey(d => d.IdMateria)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Comprendere_Materie");
            });

            modelBuilder.Entity<Coordina>(entity =>
            {
                entity.HasKey(e => new { e.IdCoordinatore, e.IdCorso });

                entity.Property(e => e.IdCoordinatore).HasColumnName("id_coordinatore");

                entity.Property(e => e.IdCorso).HasColumnName("id_corso");

                entity.HasOne(d => d.IdCoordinatoreNavigation)
                    .WithMany(p => p.Coordina)
                    .HasForeignKey(d => d.IdCoordinatore)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Coordina_Coordinatori");

                entity.HasOne(d => d.IdCorsoNavigation)
                    .WithMany(p => p.Coordina)
                    .HasForeignKey(d => d.IdCorso)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Coordina_Corsi");
            });

            modelBuilder.Entity<Coordinatori>(entity =>
            {
                entity.HasKey(e => e.IdCoordinatore);

                entity.Property(e => e.IdCoordinatore).HasColumnName("id_coordinatore");

                entity.Property(e => e.Cognome)
                    .IsRequired()
                    .HasColumnName("cognome")
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasColumnName("email")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.IdCorso).HasColumnName("id_corso");

                entity.Property(e => e.Nome)
                    .IsRequired()
                    .HasColumnName("nome")
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasColumnName("password")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.UltimoLog)
                    .HasColumnName("ultimo_log")
                    .HasColumnType("text");

                entity.Property(e => e.Username)
                    .IsRequired()
                    .HasColumnName("username")
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Corsi>(entity =>
            {
                entity.HasKey(e => e.IdCorso);

                entity.Property(e => e.IdCorso).HasColumnName("id_corso");

                entity.Property(e => e.Codice)
                    .IsRequired()
                    .HasColumnName("codice")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.CodicePrimoAnno)
                    .HasColumnName("codice_primo_anno")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.CodiceSecondoAnno)
                    .HasColumnName("codice_secondo_anno")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Descrizione).HasColumnName("descrizione");

                entity.Property(e => e.Logo)
                    .HasColumnName("logo")
                    .IsUnicode(false);

                entity.Property(e => e.Luogo)
                    .IsRequired()
                    .HasColumnName("luogo")
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Nome)
                    .IsRequired()
                    .HasColumnName("nome")
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Docenti>(entity =>
            {
                entity.HasKey(e => e.IdDocente);

                entity.Property(e => e.IdDocente)
                    .HasColumnName("id_docente")
                    .ValueGeneratedNever();

                entity.Property(e => e.Cf)
                    .IsRequired()
                    .HasColumnName("CF")
                    .HasMaxLength(16)
                    .IsUnicode(false);

                entity.Property(e => e.Codice)
                    .IsRequired()
                    .HasColumnName("codice")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Cognome)
                    .HasColumnName("cognome")
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Email)
                    .HasColumnName("email")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Nome)
                    .IsRequired()
                    .HasColumnName("nome")
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasColumnName("password")
                    .IsUnicode(false);

                entity.Property(e => e.Ritirato)
                    .IsRequired()
                    .HasColumnName("ritirato")
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('False')");
            });

            modelBuilder.Entity<Insegnare>(entity =>
            {
                entity.HasKey(e => new { e.IdDocente, e.IdMateria });

                entity.Property(e => e.IdDocente).HasColumnName("id_docente");

                entity.Property(e => e.IdMateria).HasColumnName("id_materia");

                entity.HasOne(d => d.IdDocenteNavigation)
                    .WithMany(p => p.Insegnare)
                    .HasForeignKey(d => d.IdDocente)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Insegnare_Docenti");

                entity.HasOne(d => d.IdMateriaNavigation)
                    .WithMany(p => p.Insegnare)
                    .HasForeignKey(d => d.IdMateria)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Insegnare_Materie");
            });

            modelBuilder.Entity<Lezioni>(entity =>
            {
                entity.HasKey(e => e.IdLezione);

                entity.Property(e => e.IdLezione).HasColumnName("id_lezione");

                entity.Property(e => e.Data)
                    .HasColumnName("data")
                    .HasColumnType("date");

                entity.Property(e => e.IdCalendario)
                    .HasColumnName("id_calendario")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.IdGEvent)
                    .HasColumnName("id_gEvent")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.IdMateria).HasColumnName("id_materia");

                entity.Property(e => e.OraFine).HasColumnName("ora_fine");

                entity.Property(e => e.OraInizio).HasColumnName("ora_inizio");

                entity.Property(e => e.Titolo)
                    .HasColumnName("titolo")
                    .HasColumnType("text");

                entity.HasOne(d => d.IdCalendarioNavigation)
                    .WithMany(p => p.Lezioni)
                    .HasForeignKey(d => d.IdCalendario)
                    .HasConstraintName("FK_Lezioni_Calendari");

                entity.HasOne(d => d.IdMateriaNavigation)
                    .WithMany(p => p.Lezioni)
                    .HasForeignKey(d => d.IdMateria)
                    .HasConstraintName("FK_Lezioni_Materie");
            });

            modelBuilder.Entity<LogPresenze>(entity =>
            {
                entity.HasKey(e => e.IdLog);

                entity.ToTable("Log_presenze");

                entity.Property(e => e.IdLog).HasColumnName("id_log");

                entity.Property(e => e.DataOra)
                    .HasColumnName("data_ora")
                    .HasColumnType("datetime");

                entity.Property(e => e.IdCorso).HasColumnName("id_corso");

                entity.Property(e => e.IdDocente).HasColumnName("id_docente");

                entity.Property(e => e.IdPresenza).HasColumnName("id_presenza");

                entity.Property(e => e.IdStudente).HasColumnName("id_studente");

                entity.Property(e => e.Modifiche)
                    .IsRequired()
                    .HasColumnName("modifiche")
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Materie>(entity =>
            {
                entity.HasKey(e => e.IdMateria);

                entity.Property(e => e.IdMateria).HasColumnName("id_materia");

                entity.Property(e => e.Descrizione)
                    .HasColumnName("descrizione")
                    .HasMaxLength(100);

                entity.Property(e => e.Nome)
                    .IsRequired()
                    .HasColumnName("nome")
                    .HasMaxLength(100);
            });

            modelBuilder.Entity<Presenze>(entity =>
            {
                entity.HasKey(e => e.IdPresenza);

                entity.Property(e => e.IdPresenza).HasColumnName("id_presenza");

                entity.Property(e => e.IdLezione).HasColumnName("id_lezione");

                entity.Property(e => e.IdStudente).HasColumnName("id_studente");

                entity.Property(e => e.Ingresso).HasColumnName("ingresso");

                entity.Property(e => e.Uscita).HasColumnName("uscita");

                entity.HasOne(d => d.IdLezioneNavigation)
                    .WithMany(p => p.Presenze)
                    .HasForeignKey(d => d.IdLezione)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Presenze_Lezioni");

                entity.HasOne(d => d.IdStudenteNavigation)
                    .WithMany(p => p.Presenze)
                    .HasForeignKey(d => d.IdStudente)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Presenze_Studenti");
            });

            modelBuilder.Entity<PresenzeDocente>(entity =>
            {
                entity.HasKey(e => e.IdPresenza);

                entity.Property(e => e.IdPresenza).HasColumnName("id_presenza");

                entity.Property(e => e.IdDocente).HasColumnName("id_docente");

                entity.Property(e => e.IdLezione).HasColumnName("id_lezione");

                entity.Property(e => e.Ingresso).HasColumnName("ingresso");

                entity.Property(e => e.Uscita).HasColumnName("uscita");

                entity.HasOne(d => d.IdDocenteNavigation)
                    .WithMany(p => p.PresenzeDocente)
                    .HasForeignKey(d => d.IdDocente)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PresenzeDocente_Docenti");

                entity.HasOne(d => d.IdLezioneNavigation)
                    .WithMany(p => p.PresenzeDocente)
                    .HasForeignKey(d => d.IdLezione)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PresenzeDocente_Lezioni");
            });

            modelBuilder.Entity<Studenti>(entity =>
            {
                entity.HasKey(e => e.IdStudente);

                entity.Property(e => e.IdStudente).HasColumnName("id_studente");

                entity.Property(e => e.AnnoFrequentazione).HasColumnName("anno_frequentazione");

                entity.Property(e => e.Cf)
                    .IsRequired()
                    .HasColumnName("CF")
                    .HasMaxLength(16)
                    .IsUnicode(false);

                entity.Property(e => e.Codice)
                    .IsRequired()
                    .HasColumnName("codice")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Cognome)
                    .IsRequired()
                    .HasColumnName("cognome")
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.DataNascita)
                    .HasColumnName("data_nascita")
                    .HasColumnType("date");

                entity.Property(e => e.DataRitiro)
                    .HasColumnName("data_ritiro")
                    .HasColumnType("date");

                entity.Property(e => e.Email)
                    .HasColumnName("email")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.IdCorso).HasColumnName("id_corso");

                entity.Property(e => e.Nome)
                    .IsRequired()
                    .HasColumnName("nome")
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasColumnName("password")
                    .IsUnicode(false);

                entity.Property(e => e.Promosso)
                    .IsRequired()
                    .HasColumnName("promosso")
                    .HasMaxLength(5)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('false')");

                entity.Property(e => e.Ritirato)
                    .IsRequired()
                    .HasColumnName("ritirato")
                    .HasMaxLength(5)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('false')");

                entity.HasOne(d => d.IdCorsoNavigation)
                    .WithMany(p => p.Studenti)
                    .HasForeignKey(d => d.IdCorso)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Studenti_Corsi");
            });

            modelBuilder.Entity<Tenere>(entity =>
            {
                entity.HasKey(e => new { e.IdDocente, e.IdCorso });

                entity.Property(e => e.IdDocente).HasColumnName("id_docente");

                entity.Property(e => e.IdCorso).HasColumnName("id_corso");

                entity.HasOne(d => d.IdCorsoNavigation)
                    .WithMany(p => p.Tenere)
                    .HasForeignKey(d => d.IdCorso)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Tenere_Corsi");

                entity.HasOne(d => d.IdDocenteNavigation)
                    .WithMany(p => p.Tenere)
                    .HasForeignKey(d => d.IdDocente)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Tenere_Docenti");
            });
        }
    }
}
