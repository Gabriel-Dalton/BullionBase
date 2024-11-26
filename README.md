# BullionBase

BullionBase simplifies your gold and silver investment tracking by fetching real-time prices from [vbce.ca](https://vbce.ca). With its sleek and user-friendly dashboard, BullionBase calculates your portfolio’s value in real-time and provides a clear overview of your investments.

---

## Features
- **Real-Time Data**: Fetches up-to-date buy and sell prices for gold and silver directly from VBCE.
- **Portfolio Management**: Add, edit, and track your gold and silver investments with ease.
- **Custom Collection Management**: Add items to specific wallets, view collections, and track their real-time values.
- **Empty State Messaging**: Displays helpful messaging when no items exist in your portfolio, encouraging users to start adding.
- **Wallet Management**: Create and manage multiple wallets to organize your assets by categories or purposes.
- **Secure Data Storage**: User data is stored securely using Firebase Realtime Database.
- **Mobile-Friendly Design**: Fully responsive layout for use on any device.

---

## Tech Stack
- **Frontend**: HTML, Tailwind CSS, JavaScript
- **Backend**: Firebase Realtime Database
- **APIs**: Fetches real-time price data from VBCE’s API

---

## Usage
1. **Manage Your Collection**:
   - View your collection, including real-time prices, quantities, and values.
   - Add buying information for assets, including purchase price and date.
   - If the portfolio is empty, a helpful message appears with a call-to-action button to add new items.

2. **Add to Collection**:
   - Navigate to the "Add to Collection" page to input new items, including quantity, type, and price.
   - Assign items to specific wallets for organized tracking.

3. **Wallet Management**:
   - Create multiple wallets for better organization of your assets.
   - Switch between wallets seamlessly to view or manage specific collections.

---

## Future Enhancements
- **User Authentication**: Add user login to save portfolios for multiple users.
- **Export Portfolio**: Allow users to export their portfolio data as a CSV or PDF.
- **More Metals**: Expand support to track other precious metals like palladium (whatever vbce offers).
- **Advanced Analytics**: Provide trends and historical data for better decision-making.
- **Sharing Functionality**: Share wallet summaries with others for collaborative investment tracking.