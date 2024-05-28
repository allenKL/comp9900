/* eslint-disable jest/no-conditional-expect */
import {
  apiCreateMovieIDComment,
  apiGetDirectors,
  apiGetGenres,
  apiGetMovieID,
  apiGetMovieIDComments,
  apiGetMovies,
  apiGetRecommendationMovies,
  apiGetUserProfileByUsername,
  apiLogin,
  apiRegister,
  apiUpdateMovieIDComment,
} from "../../api/apis";
import { getToken, removeToken, saveToken } from "../../components/Token";

/***************************************************************
                          Movie
***************************************************************/
describe(`${apiGetMovies.name}`, () => {
  it("Get all movies successfully", async () => {
    const [ok, data] = await apiGetMovies();
    // console.log(ok, data);
    expect(ok).toBeTruthy();
    expect(data.count).toBeGreaterThan(0);
  });

  it("Search with keywords successfully", async () => {
    let params = { search: "batman" };
    let search = new URLSearchParams(params).toString();
    // console.log(search);
    const [ok1, data1] = await apiGetMovies(search);
    // console.log(ok1, data1);
    expect(ok1).toBeTruthy();
    expect(data1.count).toBeGreaterThan(0);

    params = { genres__icontains: "", director__icontains: "" };
    search = new URLSearchParams(params).toString();
    // console.log(search);
    const [ok2, data2] = await apiGetMovies(search);
    // console.log(ok2, data2);
    expect(ok2).toBeTruthy();
    expect(data2.count).toBeGreaterThan(0);

    params = { genres__icontains: "Action", director__icontains: "" };
    search = new URLSearchParams(params).toString();
    // console.log(search);
    const [ok3, data3] = await apiGetMovies(search);
    // console.log(ok3, data3);
    expect(ok3).toBeTruthy();
    expect(data3.count).toBeGreaterThan(0);

    params = { genres__icontains: "", director__icontains: "Sam Liu" };
    search = new URLSearchParams(params).toString();
    // console.log(search);
    const [ok4, data4] = await apiGetMovies(search);
    // console.log(ok4, data4);
    expect(ok4).toBeTruthy();
    expect(data4.count).toBeGreaterThan(0);

    params = { genres__icontains: "Action", director__icontains: "Sam Liu" };
    search = new URLSearchParams(params).toString();
    // console.log(search);
    const [ok5, data5] = await apiGetMovies(search);
    // console.log(ok5, data5);
    expect(ok5).toBeTruthy();
    expect(data5.count).toBeGreaterThan(0);
  });
});

describe(`${apiGetMovieID.name}`, () => {
  it("Get Movie 1 successfully", async () => {
    const [ok, data] = await apiGetMovieID(1);
    //   console.log(ok, data);
    expect(ok).toBeTruthy();
    expect(data.id).toBe(1);
  });
});

describe(`${apiGetMovieIDComments.name}`, () => {
  it("Get Movie 1 comments successfully", async () => {
    const [ok] = await apiGetMovieIDComments(1);
    // console.log(ok, data);
    expect(ok).toBeTruthy();
    // expect(data.count).toBeGreaterThan(0);
  });
});

describe(`${apiCreateMovieIDComment.name}`, () => {
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
    saveToken(data.data.token);
  });

  afterEach(() => {
    removeToken();
  });

  it("Create a movie comments successfully", async () => {
    const username = "boning";
    const [status, data] = await apiGetUserProfileByUsername(
      username,
      getToken()
    );
    // console.log(status, data);

    if (status === 200) {
      const currentMovieID = 1;
      const currentMovieComment = data.comments.filter((comment) => {
        return comment.movie === currentMovieID;
      });
      // console.log(currentMovieComment);
      if (currentMovieComment.length !== 0) {
        expect(currentMovieComment.length).toBe(1);
        expect(currentMovieComment[0].movie).toBe(1);
      } else {
        // User has no any comments to this moive
        const reqBody = {
          movie: currentMovieID,
          score: 7,
          content: `${username} comment this movie ${currentMovieID}`,
        };
        const [ok, data] = await apiCreateMovieIDComment(reqBody, getToken());
        expect(ok).toBeTruthy();
        expect(data.content).toBe(
          `${username} comment this movie ${currentMovieID}`
        );
      }
    }
  });
});

describe(`${apiUpdateMovieIDComment.name}`, () => {
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
    // console.log(dataLogin);
    saveToken(data.data.token);
  });

  afterEach(() => {
    removeToken();
  });

  it("Update Movie comment successfully", async () => {
    const username = "boning";
    const [status, data] = await apiGetUserProfileByUsername(
      username,
      getToken()
    );
    // console.log(status, data);

    if (status === 200) {
      const currentMovieID = 1;
      const currentMovieComment = data.comments.filter((comment) => {
        return comment.movie === currentMovieID;
      });
      //   console.log(currentMovieComment);
      if (currentMovieComment.length !== 0) {
        expect(currentMovieComment.length).toBe(1);
        expect(currentMovieComment[0].movie).toBe(1);
        const reqBody = {
          score: 7,
          content: `${username} update a comment this movie ${currentMovieID} at ${new Date().toLocaleDateString()}`,
        };
        const [ok] = await apiUpdateMovieIDComment(
          currentMovieID,
          reqBody,
          getToken()
        );
        expect(ok).toBeTruthy();
      } else {
        // User has no any comments to this movie
        const reqBody = {
          movie: currentMovieID,
          score: 7,
          content: `${username} create a comment this movie ${currentMovieID}`,
        };
        const [ok, data] = await apiCreateMovieIDComment(reqBody, getToken());
        expect(ok).toBeTruthy();
        expect(data.content).toBe(
          `${username} create a comment this movie ${currentMovieID}`
        );
      }
    }
  });
});

describe(`${apiGetRecommendationMovies.name}`, () => {
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
    saveToken(data.data.token);
  });

  afterEach(() => {
    removeToken();
  });

  it("should get recommendation movie successfully", async () => {
    const [ok, data] = await apiGetRecommendationMovies(getToken());
    //   console.log(ok, data.length);
    expect(ok).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
  });
});

describe(`${apiGetDirectors.name}`, () => {
  it("Get all directors successfully", async () => {
    const [ok, data] = await apiGetDirectors();
    // console.log(ok, data);
    expect(ok).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
  });
});

describe(`${apiGetGenres.name}`, () => {
  it("Get all genres successfully", async () => {
    const [ok, data] = await apiGetGenres();
    //   console.log(ok, data);
    expect(ok).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
  });
});
