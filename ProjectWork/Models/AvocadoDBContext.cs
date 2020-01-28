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

        public virtual DbSet<Amministrare> Amministrare { get; set; }
        public virtual DbSet<Amministratori> Amministratori { get; set; }
        public virtual DbSet<Comprende> Comprende { get; set; }
        public virtual DbSet<Corsi> Corsi { get; set; }
        public virtual DbSet<Docenti> Docenti { get; set; }
        public virtual DbSet<Insegnare> Insegnare { get; set; }
        public virtual DbSet<Lezioni> Lezioni { get; set; }
        public virtual DbSet<Materie> Materie { get; set; }
        public virtual DbSet<Studenti> Studenti { get; set; }
        public virtual DbSet<Tenere> Tenere { get; set; }
        public virtual DbSet<Valutazioni> Valutazioni { get; set; }

        // Unable to generate entity type for table 'dbo.Presenze'. Please see the warning messages.

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Server=ALESSANDRO\\MSSQLSERVER02;Database=AvocadoDB;Trusted_Connection=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Amministrare>(entity =>
            {
                entity.HasKey(e => new { e.IdAdmin, e.IdCorso });

                entity.Property(e => e.IdAdmin).HasColumnName("id_admin");

                entity.Property(e => e.IdCorso).HasColumnName("id_corso");

                entity.HasOne(d => d.IdAdminNavigation)
                    .WithMany(p => p.Amministrare)
                    .HasForeignKey(d => d.IdAdmin)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Amministrare_Amministratori");

                entity.HasOne(d => d.IdCorsoNavigation)
                    .WithMany(p => p.Amministrare)
                    .HasForeignKey(d => d.IdCorso)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Amministrare_Corsi");
            });

            modelBuilder.Entity<Amministratori>(entity =>
            {
                entity.HasKey(e => e.IdAdmin);

                entity.Property(e => e.IdAdmin).HasColumnName("id_admin");

                entity.Property(e => e.Cognome)
                    .IsRequired()
                    .HasColumnName("cognome")
                    .HasMaxLength(100);

                entity.Property(e => e.Nome)
                    .IsRequired()
                    .HasColumnName("nome")
                    .HasMaxLength(100);

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasColumnName("password")
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.UltimoLog)
                    .HasColumnName("ultimo_log")
                    .HasColumnType("text");
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

            modelBuilder.Entity<Corsi>(entity =>
            {
                entity.HasKey(e => e.IdCorso);

                entity.Property(e => e.IdCorso).HasColumnName("id_corso");

                entity.Property(e => e.Descrizione).HasColumnName("descrizione");

                entity.Property(e => e.Nome)
                    .IsRequired()
                    .HasColumnName("nome")
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Docenti>(entity =>
            {
                entity.HasKey(e => e.IdDocente);

                entity.Property(e => e.IdDocente).HasColumnName("id_docente");

                entity.Property(e => e.Cf)
                    .IsRequired()
                    .HasColumnName("CF")
                    .HasMaxLength(16)
                    .IsUnicode(false);

                entity.Property(e => e.Cognome)
                    .IsRequired()
                    .HasColumnName("cognome")
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.DataNascita)
                    .HasColumnName("data_nascita")
                    .HasColumnType("date");

                entity.Property(e => e.LuogoNascita)
                    .IsRequired()
                    .HasColumnName("luogo_nascita")
                    .HasMaxLength(100)
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

            modelBuilder.Entity<Studenti>(entity =>
            {
                entity.HasKey(e => e.IdStudente);

                entity.Property(e => e.IdStudente).HasColumnName("id_studente");

                entity.Property(e => e.AnnoIscrizione)
                    .IsRequired()
                    .HasColumnName("anno_iscrizione")
                    .HasMaxLength(4);

                entity.Property(e => e.Cf)
                    .IsRequired()
                    .HasColumnName("CF")
                    .HasMaxLength(16)
                    .IsUnicode(false);

                entity.Property(e => e.Cognome)
                    .IsRequired()
                    .HasColumnName("cognome")
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.DataNascita)
                    .HasColumnName("data_nascita")
                    .HasColumnType("date");

                entity.Property(e => e.IdCorso).HasColumnName("id_corso");

                entity.Property(e => e.LuogoNascita)
                    .IsRequired()
                    .HasColumnName("luogo_nascita")
                    .HasMaxLength(100)
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

            modelBuilder.Entity<Valutazioni>(entity =>
            {
                entity.HasKey(e => e.IdValutazione);

                entity.Property(e => e.IdValutazione).HasColumnName("id_valutazione");

                entity.Property(e => e.Data)
                    .HasColumnName("data")
                    .HasColumnType("date");

                entity.Property(e => e.IdDocente).HasColumnName("id_docente");

                entity.Property(e => e.IdMateria).HasColumnName("id_materia");

                entity.Property(e => e.IdStudente).HasColumnName("id_studente");

                entity.Property(e => e.Voto)
                    .IsRequired()
                    .HasColumnName("voto")
                    .HasMaxLength(10)
                    .IsUnicode(false);

                entity.HasOne(d => d.IdDocenteNavigation)
                    .WithMany(p => p.Valutazioni)
                    .HasForeignKey(d => d.IdDocente)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Valutazioni_Docenti");

                entity.HasOne(d => d.IdMateriaNavigation)
                    .WithMany(p => p.Valutazioni)
                    .HasForeignKey(d => d.IdMateria)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Valutazioni_Materie");

                entity.HasOne(d => d.IdStudenteNavigation)
                    .WithMany(p => p.Valutazioni)
                    .HasForeignKey(d => d.IdStudente)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Valutazioni_Studenti");
            });
        }
    }
}
