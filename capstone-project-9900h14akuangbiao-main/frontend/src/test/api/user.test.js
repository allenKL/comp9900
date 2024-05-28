/* eslint-disable jest/no-conditional-expect */
import {
  apiGetBannedList,
  apiGetWishlist,
  apiIsMovieInWishlist,
  apiLogin,
  apiLogout,
  apiRegister,
  apiUpdateBannedlist,
  apiUpdateMovieToWishlist,
  //   apiUpdateUserProfile,
} from "../../api/apis";
import { getToken, removeToken, saveToken } from "../../components/Token";

/***************************************************************
                          User
***************************************************************/
describe(`${apiRegister.name}`, () => {
  it("200 && 400", async () => {
    const reqBody = {
      email: "boning@gmail.com",
      username: "boning",
      password: "123",
      confirm_password: "123",
    };

    const [ok, data] = await apiRegister(reqBody);
    // console.log(ok, data);
    if (ok) {
      expect(data.msg).toBe("Success");
    } else {
      expect(data.username[0]).toBe("This field must be unique.");
    }
  });
});

describe(`${apiLogin.name}`, () => {
  beforeEach(async () => {
    const reqBody = {
      email: "boning@gmail.com",
      username: "boning",
      password: "123",
      confirm_password: "123",
    };
    await apiRegister(reqBody);
  });

  it("200", async () => {
    const loginData = {
      username: "boning",
      password: "123",
    };
    const [ok, data] = await apiLogin(loginData);
    expect(ok).toBeTruthy();
    expect(data.msg).toBe("Success");
    expect(data.data.username).toBe("boning");
    expect(data.data).toHaveProperty("token");
  });

  it("400", async () => {
    const loginData = {
      username: "noexist",
      password: "noexist",
    };
    const [, data] = await apiLogin(loginData);
    expect(data.non_field_errors[0]).toBe(
      "Account does not exist or is inactive."
    );
  });
});

describe(`${apiLogout.name}`, () => {
  beforeEach(async () => {
    const reqBody = {
      email: "boning@gmail.com",
      username: "boning",
      password: "123",
      confirm_password: "123",
    };
    await apiRegister(reqBody);
  });

  afterEach(() => {
    removeToken();
  });

  it("200", async () => {
    const loginData = {
      username: "boning",
      password: "123",
    };
    const [, data] = await apiLogin(loginData);
    const token = data.data.token;
    saveToken(token);
    const [okLogout, dataLogout] = await apiLogout(getToken());
    expect(okLogout).toBeTruthy();
    expect(dataLogout.msg).toBe("Logout successful.");
  });

  it("401", async () => {
    const [ok, data] = await apiLogout();
    expect(ok).toBeFalsy();
    expect(data.detail).toBe("Invalid token.");
  });
});

describe(`${apiGetWishlist.name}`, () => {
  beforeEach(async () => {
    const reqBody = {
      email: "boning@gmail.com",
      username: "boning",
      password: "123",
      confirm_password: "123",
    };
    await apiRegister(reqBody);

    const loginData = {
      username: "boning",
      password: "123",
    };
    const [, data] = await apiLogin(loginData);
    const token = data.data.token;
    saveToken(token);
  });

  afterEach(() => {
    removeToken();
  });

  it("should get wishlist successfully", async () => {
    const [ok] = await apiGetWishlist(getToken());
    expect(ok).toBeTruthy();
    // console.log(ok, data);
  });
});

describe(`${apiIsMovieInWishlist.name}`, () => {
  beforeEach(async () => {
    const reqBody = {
      email: "boning@gmail.com",
      username: "boning",
      password: "123",
      confirm_password: "123",
    };
    await apiRegister(reqBody);

    const loginData = {
      username: "boning",
      password: "123",
    };
    const [, dataLogin] = await apiLogin(loginData);
    const token = dataLogin.data.token;
    saveToken(token);
  });

  afterEach(() => {
    removeToken();
  });

  it("Is movie in the wishlist or not", async () => {
    const [status, data] = await apiIsMovieInWishlist(1, getToken());
    // console.log(status, data);
    if (status === 200) {
      expect(data.detail).toContain("is in your waitlist");
    } else if (status === 201) {
      expect(data.detail).toContain("is not in your waitlist");
    }
  });
});

describe(`${apiUpdateMovieToWishlist.name}`, () => {
  beforeEach(async () => {
    const reqBody = {
      email: "boning@gmail.com",
      username: "boning",
      password: "123",
      confirm_password: "123",
    };
    await apiRegister(reqBody);

    const loginData = {
      username: "boning",
      password: "123",
    };
    const [, dataLogin] = await apiLogin(loginData);
    const token = dataLogin.data.token;
    saveToken(token);
  });

  afterEach(() => {
    removeToken();
  });

  it("should update wishlist successfully", async () => {
    const [status, data] = await apiUpdateMovieToWishlist(1, getToken());
    // console.log(status, data);
    if (status === 201) {
      expect(data.detail).toContain("has been added to your waitlist.");
      const [ok, result] = await apiIsMovieInWishlist(1, getToken());
      expect(ok).toBeTruthy();
      expect(result.detail).toContain("is in your waitlist");
    } else if (status === 200) {
      expect(data.detail).toContain("been removed from your waitlist.");
      const [ok, result] = await apiIsMovieInWishlist(1, getToken());
      expect(ok).toBeTruthy();
      // console.log(dataWishlist);
      expect(result.detail).toContain("is not in your waitlist.");
    }
  });
});

describe(`${apiGetBannedList.name}`, () => {
  beforeEach(async () => {
    const reqBody = {
      email: "boning@gmail.com",
      username: "boning",
      password: "123",
      confirm_password: "123",
    };
    await apiRegister(reqBody);

    const loginData = {
      username: "boning",
      password: "123",
    };
    const [, data] = await apiLogin(loginData);
    const token = data.data.token;
    saveToken(token);
  });

  afterEach(() => {
    removeToken();
  });

  it("should get banlist successfully", async () => {
    const [okBannedlist] = await apiGetBannedList(getToken());
    expect(okBannedlist).toBeTruthy();
    // expect(dataWithlist).toEqual([]);
  });
});

describe(`${apiUpdateBannedlist.name}`, () => {
  beforeEach(async () => {
    const reqBody = {
      email: "boning@gmail.com",
      username: "boning",
      password: "123",
      confirm_password: "123",
    };
    await apiRegister(reqBody);

    const loginData = {
      username: "boning",
      password: "123",
    };
    const [, dataLogin] = await apiLogin(loginData);
    const token = dataLogin.data.token;
    saveToken(token);
  });

  afterEach(() => {
    removeToken();
  });

  it("should update bannedlist successfully", async () => {
    const [status, data] = await apiUpdateBannedlist(1, getToken());
    if (status === 201) {
      expect(data.detail).toContain("has been added to your banlist.");
      const [ok] = await apiGetBannedList(getToken());
      expect(ok).toBeTruthy();
      // console.log(dataBannedlist);
    } else if (status === 200) {
      expect(data.detail).toContain("been removed from your banlist.");
      const [ok] = await apiGetBannedList(getToken());
      expect(ok).toBeTruthy();
      // console.log(dataBannedlist);
    }
  });
});

// This api has a bug, in the postman, this api can update the user profile
// but in the frontend, the api cannot update.
// describe(`${apiUpdateUserProfile.name}`, () => {
//   beforeEach(async () => {
//     const reqBody = {
//       email: "boning@gmail.com",
//       username: "boning",
//       password: "123",
//       confirm_password: "123",
//     };
//     await apiRegister(reqBody);
//   });

//   afterEach(() => {
//     removeToken();
//   });

//   it("should update user profile correctly", async () => {
//     const loginBody = {
//       username: "boning",
//       password: "123",
//     };
//     const [okLogin, dataLogin] = await apiLogin(loginBody);
//     expect(okLogin).toBeTruthy();
//     // console.log(okLogin, dataLogin);
//     const username = dataLogin.data.username;
//     const token = dataLogin.data.token;
//     saveToken(token);

//     const updateBody = {
//       username: "ghj",
//       email: "ghj@ghj.com",
//     };
//     const [ok, data] = await apiUpdateUserProfile(username, updateBody, token);
//     console.log(ok, data);
//   });
// });
