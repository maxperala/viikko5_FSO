import axios from "axios";

const baseUrl = "api/users/login";
const baseUrl2 = "api/blogs";

const login = async (username, password) => {
  try {
    const credentials = { username: username, password: password };
    const response = await axios.post(baseUrl, credentials);
    return response.data;
  } catch (e) {
    return { error: "invalid" };
  }
};
const submit = async (blog, token) => {
  const request = blog;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  //request["Authorization"] = `Bearer ${token}`;
  //console.log("request!!:: ", request);
  const res = await axios.post(baseUrl2, request, config);
  console.log(res);
  return res;
};
const api = { login, submit };
export default api;
