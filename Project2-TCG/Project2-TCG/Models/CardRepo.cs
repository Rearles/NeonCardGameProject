using Project2_TCG.Models.Entities;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Project2_TCG.Models
{
    /// <summary>
    /// implementation of ICardRepo
    /// </summary>
    public class CardRepo : ICardRepo
    {
        private cardgameContext _context;

        public CardRepo(cardgameContext context)
        {
            _context = context;
        }

        public CreatedUser AddUser(string username, string password)
        {
            try
            {
                var user = _context.Users.Single(u => u.Username == username);
                return new CreatedUser("error", "error");
            }
            catch (System.InvalidOperationException)
            {
                _context.Users.Add(new Entities.User
                {
                    Username = username,
                    Password = password
                    
                });
                _context.SaveChanges();
                return new CreatedUser(username, password);
            }
        }

        List<Card> ICardRepo.FilterCardsByRarity(Rarity rarity)
        {
            throw new NotImplementedException();
        }

        Color ICardRepo.GetColor(int id)
        {
            throw new NotImplementedException();
        }

        public Card GetRandomCard()
        {
            var cardCount = _context.Cards.Count();
            Random random = new Random();
            int selection = random.Next(1, cardCount);

            var card = _context.Cards.Single(c => c.Id == selection);
            var color = _context.Colors.Single(c => c.Id == card.Color);
            var rarity = _context.Rarities.Single(r => r.Id == card.Rarity);
            Card foundCard = new Card(card.Id, card.Cost, card.Attack, card.Defense, card.Name, color.Color1, rarity.Rarity1); 
            return foundCard;
        }
        public Card GetRandomCardofRarity(int id)
        {
            List<Entities.Card> query = _context.Cards.Where(x => x.Rarity == id).ToList();//grab all cards with the given rarity
            var cardCount = query.Count();
            Random random = new Random();
            int selection = random.Next(0, cardCount); //choose a random index from those cards selected (upper bound exclusive)
            Entities.Card card = query[selection]; //find the card at the selected id
            var color = _context.Colors.Single(c => c.Id == card.Color);
            var rarity = _context.Rarities.Single(r => r.Id == card.Rarity);
            Card foundCard = new Card(card.Id, card.Cost, card.Attack, card.Defense, card.Name, color.Color1, rarity.Rarity1);
            Log.Debug("We found the card at the rarity of " + foundCard.Rarity + ". At Id of " + foundCard.Id);
            return foundCard;//return that card
            
        }
        Rarity ICardRepo.GetRarity(int id)
        {
            throw new NotImplementedException();
        }

        User ICardRepo.GetUserByName(string name)
        {
            var user = _context.Users.Single(u => u.Username.Equals(name));
            User foundUser = new User(user.Id, user.Username, user.Password, user.Currency);
            return foundUser;
        }

        Card GetCardById(int cardId)
        {
            Entities.Card card = _context.Cards.FirstOrDefault(x => x.Id == cardId);
            var color = _context.Colors.Single(c => c.Id == card.Color);
            var rarity = _context.Rarities.Single(r => r.Id == card.Rarity);
            Card foundCard = new Card(card.Id, card.Cost, card.Attack, card.Defense, card.Name, color.Color1, rarity.Rarity1);
            return foundCard;
        }
        List<Card> ICardRepo.GetUsersCards(int userId)//grab all cards from Card/User join at the userid
        {

            List<Card> cards = new List<Card>();
            List<UsersCard> userscards = _context.UsersCards.Where(x => x.UserId == userId).ToList();//models.entity
            foreach (UsersCard u in userscards)
            {

                //u.card is models.entities.card and cards is models.card so take every aspect of a UsersCard.Card and put it into a Models.Card
                Card card = GetCardById(u.CardId);
                    for (int i = 1; i <= u.Quantity; i++)//this adds quantity of cards to the user.
                    {
                        cards.Add(card);
                    }
            }
            return cards;
        }

        List<Card> ICardRepo.OpenPack(int numPacks)
        {
            throw new NotImplementedException();
        }

        public Card SearchCardByName(string searchString)
        {
            var card = _context.Cards.Single(c => c.Name.Equals(searchString));
            var color = _context.Colors.Single(c => c.Id == card.Color);
            var rarity = _context.Rarities.Single(r => r.Id == card.Rarity);

            Card foundCard = new Card(card.Id, card.Cost, card.Attack, card.Defense, card.Name, color.Color1, rarity.Rarity1);
            return foundCard;
        }

        void ICardRepo.UpdateUserCurrency(User user, int currency, bool plusminus)
        {
            var founduser = _context.Users.Single(u => u.Id == user.Id);
            if (founduser != null)
            {
                if (plusminus == true)
                {
                    founduser.Currency = (founduser.Currency ?? 0) + currency;
                }
                else if (plusminus == false)
                {
                    founduser.Currency = (founduser.Currency ?? 0) - currency;
                }
                _context.Update(founduser);
                _context.SaveChanges();
            }
        }

        public User AddCurrency(string username, int amount)
        {
            var founduser = _context.Users.Single(u => u.Username == username);
            founduser.Currency = (founduser.Currency ?? 0) + amount;
            _context.Update(founduser);
            _context.SaveChanges();
            return new User(founduser.Id, founduser.Username, founduser.Password, founduser.Currency);
        }

        public User SearchUserById(int id)
        {
            var user = _context.Users.Single(u => u.Id == id);
            User foundUser = new User(user.Username, user.Password);
            return foundUser;
        }

        public User LogIn(string username, string password)
        {
            try
            {
                var user = _context.Users.Single(u => u.Username == username && u.Password == password);
                return new User(user.Id, user.Username, user.Password, user.Currency);
            }
            catch (System.InvalidOperationException)
            {
                return new User("error", "error");
            }
        }

        public Entities.UsersCard AddCardToUsersCollection(int userId, int cardId)
        {
            Entities.UsersCard inst = _context.UsersCards.FirstOrDefault(x => x.CardId == cardId && x.UserId == userId);
            if (inst == null) {
                _context.UsersCards.Add(new Entities.UsersCard{
                                    UserId = userId,
                                    CardId = cardId,
                                    Quantity = 1}
                );
            }else{
                inst.Quantity++;
                _context.Update(inst);
            }
            _context.SaveChanges();
            return inst;
        }
    }
}
