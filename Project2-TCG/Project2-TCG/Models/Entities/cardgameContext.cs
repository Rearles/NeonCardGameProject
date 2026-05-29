using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace Project2_TCG.Models.Entities
{
    public partial class cardgameContext : DbContext
    {
        public cardgameContext()
        {
        }

        public cardgameContext(DbContextOptions<cardgameContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Card> Cards { get; set; }
        public virtual DbSet<Color> Colors { get; set; }
        public virtual DbSet<Rarity> Rarities { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<UsersCard> UsersCards { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Card>(entity =>
            {
                entity.ToTable("Card");

                entity.Property(e => e.Name)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.HasOne(d => d.ColorNavigation)
                    .WithMany(p => p.Cards)
                    .HasForeignKey(d => d.Color)
                    .HasConstraintName("FK__Card__Color__60A75C0F");

                entity.HasOne(d => d.RarityNavigation)
                    .WithMany(p => p.Cards)
                    .HasForeignKey(d => d.Rarity)
                    .HasConstraintName("FK__Card__Rarity__6477ECF3");
            });

            modelBuilder.Entity<Color>(entity =>
            {
                entity.ToTable("Color");

                entity.Property(e => e.Color1)
                    .IsRequired()
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("Color");
            });

            modelBuilder.Entity<Rarity>(entity =>
            {
                entity.ToTable("Rarity");

                entity.Property(e => e.Rarity1)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("Rarity");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false);

                entity.Property(e => e.Username)
                    .IsRequired()
                    .HasMaxLength(16)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<UsersCard>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CardId).HasColumnName("cardId");

                entity.Property(e => e.Quantity).HasColumnName("quantity");

                entity.Property(e => e.UserId).HasColumnName("userId");

                entity.HasOne(d => d.Card)
                    .WithMany(p => p.UsersCards)
                    .HasForeignKey(d => d.CardId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__UsersCard__cardI__7E37BEF6");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UsersCards)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__UsersCard__userI__7D439ABD");
            });

            modelBuilder.Entity<Color>().HasData(
                new Color { Id = 1, Color1 = "Empty" }
            );

            modelBuilder.Entity<Rarity>().HasData(
                new Rarity { Id = 1, Rarity1 = "common" },
                new Rarity { Id = 2, Rarity1 = "unusual" },
                new Rarity { Id = 3, Rarity1 = "rare" },
                new Rarity { Id = 4, Rarity1 = "mega rare" }
            );

            modelBuilder.Entity<Card>().HasData(
                // Common (rarity 1)
                new Card { Id = 1, Name = "Richard Racoon", Cost = 1, Attack = 1, Defense = 1, Color = 1, Rarity = 1 },
                new Card { Id = 2, Name = "Robert", Cost = 1, Attack = 2, Defense = 1, Color = 1, Rarity = 1 },
                new Card { Id = 3, Name = "Carl", Cost = 1, Attack = 1, Defense = 2, Color = 1, Rarity = 1 },
                new Card { Id = 4, Name = "Jim", Cost = 2, Attack = 2, Defense = 2, Color = 1, Rarity = 1 },
                new Card { Id = 5, Name = "Big Jerk", Cost = 2, Attack = 3, Defense = 1, Color = 1, Rarity = 1 },
                new Card { Id = 6, Name = "Grey Milk", Cost = 1, Attack = 0, Defense = 3, Color = 1, Rarity = 1 },
                new Card { Id = 7, Name = "Fightin'Jack", Cost = 2, Attack = 3, Defense = 2, Color = 1, Rarity = 1 },
                new Card { Id = 8, Name = "Mildly Good Info", Cost = 1, Attack = 1, Defense = 1, Color = 1, Rarity = 1 },
                new Card { Id = 9, Name = "Bad News Bear", Cost = 2, Attack = 2, Defense = 3, Color = 1, Rarity = 1 },
                new Card { Id = 10, Name = "liam", Cost = 1, Attack = 2, Defense = 2, Color = 1, Rarity = 1 },
                new Card { Id = 11, Name = "testcard", Cost = 1, Attack = 1, Defense = 1, Color = 1, Rarity = 1 },
                // Unusual (rarity 2)
                new Card { Id = 12, Name = "Dapper Croc", Cost = 3, Attack = 3, Defense = 3, Color = 1, Rarity = 2 },
                new Card { Id = 13, Name = "Happiest Robot", Cost = 3, Attack = 2, Defense = 4, Color = 1, Rarity = 2 },
                new Card { Id = 14, Name = "Ghost", Cost = 2, Attack = 3, Defense = 2, Color = 1, Rarity = 2 },
                new Card { Id = 15, Name = "Snowman", Cost = 3, Attack = 2, Defense = 3, Color = 1, Rarity = 2 },
                new Card { Id = 16, Name = "CAT", Cost = 2, Attack = 2, Defense = 2, Color = 1, Rarity = 2 },
                new Card { Id = 17, Name = "Swing Car", Cost = 3, Attack = 4, Defense = 2, Color = 1, Rarity = 2 },
                new Card { Id = 18, Name = "dinotank", Cost = 4, Attack = 3, Defense = 4, Color = 1, Rarity = 2 },
                new Card { Id = 19, Name = "Not a Bear", Cost = 3, Attack = 3, Defense = 2, Color = 1, Rarity = 2 },
                // Rare (rarity 3)
                new Card { Id = 20, Name = "Curious Wizard", Cost = 4, Attack = 4, Defense = 4, Color = 1, Rarity = 3 },
                new Card { Id = 21, Name = "Killer Rabbit", Cost = 4, Attack = 5, Defense = 3, Color = 1, Rarity = 3 },
                new Card { Id = 22, Name = "Gentle Triceritops", Cost = 5, Attack = 4, Defense = 5, Color = 1, Rarity = 3 },
                new Card { Id = 23, Name = "Unicorn", Cost = 4, Attack = 4, Defense = 4, Color = 1, Rarity = 3 },
                new Card { Id = 24, Name = "Foolish Knight", Cost = 4, Attack = 5, Defense = 4, Color = 1, Rarity = 3 },
                // Mega rare (rarity 4)
                new Card { Id = 25, Name = "Smug Dragon", Cost = 6, Attack = 7, Defense = 6, Color = 1, Rarity = 4 },
                new Card { Id = 26, Name = "Doom Cannon", Cost = 6, Attack = 8, Defense = 4, Color = 1, Rarity = 4 },
                new Card { Id = 27, Name = "Robo-Serpant", Cost = 7, Attack = 7, Defense = 7, Color = 1, Rarity = 4 }
            );

            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, Username = "test", Password = "test", Currency = 9999 }
            );

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
