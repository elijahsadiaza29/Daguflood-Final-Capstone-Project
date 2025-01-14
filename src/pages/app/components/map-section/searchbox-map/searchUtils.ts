
export interface RecentSearch {
    address: string;
    lat: number;
    lng: number;
}

export const storeRecentSearch = (address: string, lat: number, lng: number): void => {
    const recentSearches = getRecentSearches();
    
    // Check if the search already exists to avoid duplicates
    if (!recentSearches.some((search) => search.address === address)) {
        // Limit to 5 recent searches
        if (recentSearches.length >= 5) {
            recentSearches.pop();
        }
        recentSearches.unshift({ address, lat, lng });
        localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
    }
};

export const getRecentSearches = (): RecentSearch[] => {
    return JSON.parse(localStorage.getItem("recentSearches") || "[]");
};

export const deleteRecentSearch = (address: string): RecentSearch[] => {
    let recentSearches = getRecentSearches();
    recentSearches = recentSearches.filter((item) => item.address !== address);
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
    return recentSearches;
};


export const clearRecentSearches = (): void => {
    localStorage.removeItem('recentSearches');
};

export const filterSearchResults = (
    places: google.maps.places.PlaceResult[], 
    bounds: google.maps.LatLngBounds
): google.maps.places.PlaceResult[] => {
    return places.filter(place => 
        bounds.contains(place.geometry?.location as google.maps.LatLng)
    );
};