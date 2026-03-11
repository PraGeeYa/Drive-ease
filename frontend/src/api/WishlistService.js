// src/api/WishlistService.js
const WishlistService = {
    getFavorites: () => {
        const favs = localStorage.getItem('favorites');
        return favs ? JSON.parse(favs) : [];
    },
    toggleFavorite: (vehicle) => {
        let favs = WishlistService.getFavorites();
        const exists = favs.find(v => v.id === vehicle.id);
        
        if (exists) {
            favs = favs.filter(v => v.id !== vehicle.id);
        } else {
            favs.push(vehicle);
        }
        localStorage.setItem('favorites', JSON.stringify(favs));
        return favs;
    }
};
export default WishlistService;