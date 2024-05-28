const keyToken = "pc";
const keyUserName = "userName";

const saveToken = (token) => {
  return window.localStorage.setItem(keyToken, token);
};

const getToken = () => {
  return window.localStorage.getItem(keyToken);
};

const removeToken = () => {
  window.localStorage.removeItem(keyToken);
};

const getUsername = () => {
  return window.localStorage.getItem(keyUserName);
}

export { saveToken, getToken, removeToken, getUsername };
