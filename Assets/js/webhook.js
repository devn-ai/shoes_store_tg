
window.addEventListener('DOMContentLoaded', function () {
  // Перевіряємо, чи підключений Telegram WebApp
  if (window.Telegram && Telegram.WebApp && Telegram.WebApp.initDataUnsafe && Telegram.WebApp.initDataUnsafe.user) {
    const userId = Telegram.WebApp.initDataUnsafe.user.id;
    document.getElementById('customer-id').value = userId;
  } //else {
    // fallback, якщо доступу до Telegram WebApp немає (наприклад, не з Telegram)
    //document.getElementById('customer-id').value = '';
  //}
});

