/* eslint-disable jest/no-conditional-expect */
import {
  apiCreateDiscussionComment,
  apiDeleteDiscussionCommentByID,
  apiGetAllDiscussionCommentsByDiscussionID,
  apiGetAllDiscussions,
  apiGetDiscussionByID,
  apiGetDiscussionCommentByCommentID,
  apiLogin,
  apiRegister,
  apiUpdateDiscussionCommentByID,
} from "../../api/apis";
import { getToken, removeToken, saveToken } from "../../components/Token";

/***************************************************************
                    Discussion Comment
***************************************************************/
describe(`${apiCreateDiscussionComment.name}`, () => {
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

  it("Create discussion comment by discussion id successfully", async () => {
    const [ok1, data1] = await apiGetAllDiscussions(getToken());
    expect(ok1).toBeTruthy();
    // console.log(data1);
    if (data1.results.length > 0) {
      const [ok2, data2] = await apiGetDiscussionByID(
        getToken(),
        data1.results[0].id
      );
      expect(ok2).toBeTruthy();
      // console.log(data2);

      const discussionID = data2.id;
      const reqBody = {
        content: `new comment`,
      };
      const [ok3, data3] = await apiCreateDiscussionComment(
        getToken(),
        discussionID,
        reqBody
      );
      //   console.log(ok3, data3);
      expect(ok3).toBeTruthy();
      expect(data3.content).toBe(reqBody.content);
    }
  });
});

describe(`${apiGetAllDiscussionCommentsByDiscussionID.name}`, () => {
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

  it("Get discussion comments by discussion id successfully", async () => {
    const [ok1, data1] = await apiGetAllDiscussions(getToken());
    expect(ok1).toBeTruthy();
    // console.log(ok1, data1);
    if (data1.results.length > 0) {
      const [ok2, data2] = await apiGetDiscussionByID(
        getToken(),
        data1.results[0].id
      );
    //   console.log(ok2, data2);
      expect(ok2).toBeTruthy();

      const discussionID = data2.id;
      const [ok3, data3] = await apiGetAllDiscussionCommentsByDiscussionID(
        getToken(),
        discussionID
      );
      expect(ok3).toBeTruthy();
      //   console.log(ok3, data3);
      expect(ok3).toBeTruthy();
      expect(data3.count).toBeGreaterThan(0);
    }
  });
});

describe(`${apiGetDiscussionCommentByCommentID.name}`, () => {
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

  it("Get discussion comment by comment id successfully", async () => {
    const [ok1, data1] = await apiGetAllDiscussions(getToken());
    expect(ok1).toBeTruthy();
    // console.log(data1);
    if (data1.results.length > 0) {
      const [ok2, data2] = await apiGetDiscussionByID(
        getToken(),
        data1.results[0].id
      );
      expect(ok2).toBeTruthy();
      // console.log(data2);

      const discussionID = data2.id;
      const [ok3, data3] = await apiGetAllDiscussionCommentsByDiscussionID(
        getToken(),
        discussionID
      );
      expect(ok3).toBeTruthy();
      // console.log(ok3, data3);

      const commentID = data3.results[data3.results.length - 1].id;
      //   console.log(commentID);
      const [ok4, data4] = await apiGetDiscussionCommentByCommentID(
        getToken(),
        commentID
      );
      //   console.log(ok4, data4);
      expect(ok4).toBeTruthy();
      expect(data4).toHaveProperty("content");
    }
  });
});

describe(`${apiUpdateDiscussionCommentByID.name}`, () => {
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

  it("Update discussion comment by comment id successfully", async () => {
    const [ok1, data1] = await apiGetAllDiscussions(getToken());
    expect(ok1).toBeTruthy();
    // console.log(data1);
    if (data1.results.length > 0) {
      const [ok2, data2] = await apiGetDiscussionByID(
        getToken(),
        data1.results[data1.results.length - 1].id
      );
      expect(ok2).toBeTruthy();
      // console.log(data2);

      const discussionID = data2.id;
      const reqBody = {
        content: `new comment`,
      };
      const [ok3, data3] = await apiCreateDiscussionComment(
        getToken(),
        discussionID,
        reqBody
      );
      //   console.log(ok3, data3);
      expect(ok3).toBeTruthy();
      expect(data3.content).toBe(reqBody.content);

      const updateBody = {
        content: `update comment`,
      };
      const [ok4, data4] = await apiUpdateDiscussionCommentByID(
        getToken(),
        data3.id,
        updateBody
      );
      //   console.log(ok4, data4);
      expect(ok4).toBeTruthy();
      expect(data4.content).toBe(updateBody.content);
    }
  });
});

describe(`${apiDeleteDiscussionCommentByID.name}`, () => {
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

  it("Delete discussion comment by comment id successfully", async () => {
    const [ok1, data1] = await apiGetAllDiscussions(getToken());
    expect(ok1).toBeTruthy();
    // console.log(data1);
    if (data1.results.length > 0) {
      const [ok2, data2] = await apiGetDiscussionByID(
        getToken(),
        data1.results[data1.results.length - 1].id
      );
      expect(ok2).toBeTruthy();
      // console.log(data2);

      const discussionID = data2.id;
      const reqBody = {
        content: `new comment`,
      };
      const [ok3, data3] = await apiCreateDiscussionComment(
        getToken(),
        discussionID,
        reqBody
      );
      //   console.log(ok3, data3);
      expect(ok3).toBeTruthy();
      expect(data3.content).toBe(reqBody.content);

      const [ok4, data4] = await apiDeleteDiscussionCommentByID(
        getToken(),
        data3.id
      );
    //   console.log(ok4, data4);
      expect(ok4).toBeTruthy();
      expect(data4).toEqual({});
    }
  });
});
