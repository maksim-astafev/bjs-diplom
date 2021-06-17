"use strict"
//--- Реализация страницы «Личный кабинет пользователя»

// Выход из личного кабинета
logoutButton = new LogoutButton();
logoutButton.action  = () => {
  ApiConnector.logout((responseBody) => {
    if(responseBody.success) {
      location.reload();
    } 
  });
}

// Получение информации о пользователе
ApiConnector.current((responseBody) => {
  if(responseBody.success) {
    ProfileWidget.showProfile(responseBody.data);
  } 
} );

// Получение текущих курсов валюты
ratesBoard = new RatesBoard();
function checkStocks(responseBody) {
  if(responseBody.success) {
    ratesBoard.clearTable();
    ratesBoard.fillTable(responseBody.data);
  } 
}
ApiConnector.getStocks(checkStocks);
setInterval(() => ApiConnector.getStocks(checkStocks), 1000*60);

// Операции с деньгами
moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = (data) => {
  ApiConnector.addMoney(data, (responseBody) => {
    if(responseBody.success) {
      ProfileWidget.showProfile(responseBody.data);
      moneyManager.setMessage(true, "Средства успешно добавлены");
    } else {
      moneyManager.setMessage(false, responseBody.error);
    }
  });
}

moneyManager.conversionMoneyCallback = (data) => {
  ApiConnector.convertMoney(data, (responseBody) => {
    if(responseBody.success) {
      ProfileWidget.showProfile(responseBody.data);
      moneyManager.setMessage(true, "Средства успешно конвертированы");
    } else {
      moneyManager.setMessage(false, responseBody.error);
    }
  });
}

moneyManager.sendMoneyCallback = (data) => {
  ApiConnector.transferMoney(data, (responseBody) => {
    if(responseBody.success) {
      ProfileWidget.showProfile(responseBody.data);
      moneyManager.setMessage(true, "Средства успешно переведены");
    } else {
      moneyManager.setMessage(false, responseBody.error);
    }
  });
}

// Работа с избранным
favoritesWidget = new FavoritesWidget();
ApiConnector.getFavorites((responseBody) => {
  if(responseBody.success) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(responseBody.data);
    moneyManager.updateUsersList(responseBody.data);
  } 
});

favoritesWidget.addUserCallback = (data) => {
  ApiConnector.addUserToFavorites(data, (responseBody) => {
    if(responseBody.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(responseBody.data);
      moneyManager.updateUsersList(responseBody.data);
      favoritesWidget.setMessage(true, "Пользователь успешно добавлен");
    } else {
      favoritesWidget.setMessage(false, responseBody.error);
    }
  });
}

favoritesWidget.removeUserCallback = (data) => {
  ApiConnector.removeUserFromFavorites(data, (responseBody) => {
    if(responseBody.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(responseBody.data);
      moneyManager.updateUsersList(responseBody.data);
      favoritesWidget.setMessage(true, "Пользователь успешно удалён");
    } else {
      favoritesWidget.setMessage(false, responseBody.error);
    }
  });
}