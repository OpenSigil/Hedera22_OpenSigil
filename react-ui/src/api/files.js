import axios from "./index";

class FilesApi {
  static Encrypt = (data) => {
    return axios.post(`${base}/encrypt`, data);
  };

  static Decrypt = (data) => {
    return axios.post(`${base}/decrypt`, data);
  };
}

let base = "sigil";

export default FilesApi;
