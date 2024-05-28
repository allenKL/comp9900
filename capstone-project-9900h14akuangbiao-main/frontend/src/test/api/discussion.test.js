/* eslint-disable jest/no-conditional-expect */
import {
  apiCreateDiscussion,
  apiDeleteDiscussionByID,
  apiGetAllDiscussions,
  apiGetDiscussionByID,
  apiLogin,
  apiRegister,
  apiUpdateDiscussionByID,
} from "../../api/apis";
import { getToken, removeToken, saveToken } from "../../components/Token";

/***************************************************************
                          Discussion
***************************************************************/
describe(`${apiCreateDiscussion.name}`, () => {
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
    // console.log(dataLogin);
    const token = dataLogin.data.token;
    saveToken(token);
  });

  afterEach(() => {
    removeToken();
  });

  it("Create discussion successfully", async () => {
    const reqBody = {
      title: "new discussion",
      content: "new discussion",
    };
    const [ok, data] = await apiCreateDiscussion(reqBody, getToken());
    // console.log(ok, data);
    expect(ok).toBeTruthy();
    expect(data.title).toBe(reqBody.title);
    expect(data.content).toBe(reqBody.content);
  });
});

describe(`${apiGetAllDiscussions.name}`, () => {
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
    // console.log(dataLogin);
    const token = dataLogin.data.token;
    saveToken(token);
  });

  afterEach(() => {
    removeToken();
  });

  it("Get all discussions successfully", async () => {
    const [ok, data] = await apiGetAllDiscussions(getToken());
    // console.log(ok, data);
    expect(ok).toBeTruthy();
    expect(data.count).toBeGreaterThan(0);
  });
});

describe(`${apiGetDiscussionByID.name}`, () => {
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
    // console.log(dataLogin);
    const token = dataLogin.data.token;
    saveToken(token);
  });

  afterEach(() => {
    removeToken();
  });

  it("Get discussion by id successfully", async () => {
    const [ok1, data1] = await apiGetAllDiscussions(getToken());
    expect(ok1).toBeTruthy();
    // console.log(data1);
    if (data1.results.length > 0) {
      const [ok2, data2] = await apiGetDiscussionByID(
        getToken(),
        data1.results[0].id
      );
      //   console.log(ok2, data2);
      expect(ok2).toBeTruthy();
      expect(data2).toHaveProperty("title");
      expect(data2).toHaveProperty("content");
    }
  });
});

describe(`${apiUpdateDiscussionByID.name}`, () => {
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
    // console.log(dataLogin);
    const token = dataLogin.data.token;
    saveToken(token);
  });

  afterEach(() => {
    removeToken();
  });

  it("Update discussion by id successfully", async () => {
    const [ok1, data1] = await apiGetAllDiscussions(getToken());
    // console.log(ok1, data1);
    expect(ok1).toBeTruthy();
    // console.log(data1);
    if (data1.results.length > 0) {
      const [ok2, data2] = await apiGetDiscussionByID(
        getToken(),
        data1.results[data1.results.length - 1].id
      );
      expect(ok2).toBeTruthy();
      //   console.log(ok2, data2);

      const discussionID = data2.id;
      const reqBody = {
        title: "update discussion",
        content: "update discussion",
      };
      const [ok3, data3] = await apiUpdateDiscussionByID(
        getToken(),
        discussionID,
        reqBody
      );
      //   console.log(ok3, data3);
      expect(ok3).toBeTruthy();
      expect(data3).toHaveProperty("title");
      expect(data3).toHaveProperty("content");
    }
  });
});

describe(`${apiDeleteDiscussionByID.name}`, () => {
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
    // console.log(dataLogin);
    const token = dataLogin.data.token;
    saveToken(token);
  });

  afterEach(() => {
    removeToken();
  });

  it("Delete discussion by id successfully", async () => {
    const reqBody = {
      title: "new discussion",
      content: "new discussion",
    };
    const [ok, data] = await apiCreateDiscussion(reqBody, getToken());
    // console.log(ok, data);
    expect(ok).toBeTruthy();
    const discussionID = data.id;
    const [ok2, data2] = await apiDeleteDiscussionByID(
      getToken(),
      discussionID
    );
    // console.log(ok2, data2);
    expect(ok2).toBeTruthy();
    expect(data2).toEqual({});
  });
});
