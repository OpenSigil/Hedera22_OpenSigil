import axios from "./index";

class FilesApi {
  static Encrypt = (file) => {
    let form = new FormData();
    form.append('data', file);

    return axios.post(`${base}/encrypt`, form);
  };

  static Decrypt = (file) => {
    let form = new FormData();
    form.append('data', file);
    
    return axios.post(`${base}/decrypt`, form);
  };
}

let base = "sigil";

export default FilesApi;
