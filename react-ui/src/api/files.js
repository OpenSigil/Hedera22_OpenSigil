import axios from "./index";

class FilesApi {
  static Encrypt = (file) => {
    let form = new FormData();
    form.append('data', file);

    return axios.post(`${base}/hedera`, form, {
      headers: {
        'ACCOUNT-ID': '0.0.34729650',
        'PUBLIC-KEY': 'ForDemoPurposesOnly!',
        'PRIVATE-KEY': ''
      }
    });
  };

  static Decrypt = (file) => {
    let form = new FormData();
    form.append('data', file);
    
    return axios.post(`${base}/decrypt`, form);
  };
}

let base = "sigil";

export default FilesApi;
