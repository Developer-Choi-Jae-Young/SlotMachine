const validatePassword = (password) => {
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return hasSpecial && hasLetter && hasNumber && password.length >= 8;
  };
  
  const getUsers = () => {
    const users = sessionStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  };
  
  const saveUsers = (users) => {
    sessionStorage.setItem('users', JSON.stringify(users));
  };
  
  const getCurrentUser = () => {
    const user = sessionStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  };
  
  const saveCurrentUser = (user) => {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
  };
  
  const updateUserInStorage = (updatedUser) => {
    const users = getUsers();
    const index = users.findIndex(u => u.username === updatedUser.username);
    if (index !== -1) {
      users[index] = updatedUser;
      saveUsers(users);
      saveCurrentUser(updatedUser);
    }
  };

  export { getCurrentUser, getUsers, saveUsers, saveCurrentUser, updateUserInStorage, validatePassword };
