using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Project2_TCG.Models
{
    public interface ICardRepo
    {
        /// <summary>
        /// get a user by their name
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public User GetUserByName(string name);
        /// <summary>
        /// get a list of cards with matching string
        /// </summary>
        /// <param name="searchString"></param>
        /// <returns></returns>
        public Card SearchCardByName(string searchString);
        /// <summary>
        /// get a 
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public List<Card> GetUsersCards(int userId);
        /// <summary>
        /// get rarity from database
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Rarity GetRarity(int id);
        /// <summary>
        /// Get a color from database
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Color GetColor(int id);
        /// <summary>
        /// get a random assortment of "numPacks" * 5 cards from database
        /// </summary>
        /// <param name="numPacks"></param>
        /// <returns></returns>
        public List<Card> OpenPack(int numPacks); //both add packs to users collection and return the list for display
        /// <summary>
        /// get a random card from the database
        /// </summary>
        /// <returns></returns>
        public Card GetRandomCard();
        /// <summary>
        /// Get a random card with a certain rarity from the database
        /// </summary>
        /// <param name="rarity"></param>
        /// <returns></returns>
        public Card GetRandomCardofRarity(int id);
        /// <summary>
        /// add a user to the database
        /// </summary>
        /// <returns></returns>
        public CreatedUser AddUser(string username, string password);
        /// <summary>
        /// update the amount of currency a given user has
        /// </summary>
        public void UpdateUserCurrency(User user, int currency, bool plusminus);
        /// <summary>
        /// add (or subtract, if negative) currency for a user by username; persists and returns the updated user
        /// </summary>
        public User AddCurrency(string username, int amount);
        /// <summary>
        /// filter cards by a certain rarity and return a list of matching cards
        /// </summary>
        /// <param name="rarity"></param>
        /// <returns></returns>
        public List<Card> FilterCardsByRarity(Rarity rarity);
        /// <summary>
        /// search for a user by their Id
        /// </summary>
        /// <param name="Id"></param>
        public User SearchUserById(int id);
        /// <summary>
        /// Returns an object indicating if credentials were valid
        /// </summary>
        public User LogIn(string username, string password);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="userid"></param>
        /// <param name="card"></param>
        public Entities.UsersCard AddCardToUsersCollection(int userId, int cardId);
    }
}
