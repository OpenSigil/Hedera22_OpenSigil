import axios from "./index";

class FilesApi {
  static Encrypt = (file) => {
    let form = new FormData();
    form.append('data', file);

    return axios.post(`${base}/hedera`, form, {
      headers: {
        'ACCOUNT-ID': '0.0.34729650',
        'PUBLIC-KEY': 'ForDemoPurposesOnly!',
        'PRIVATE-KEY': '302e020100300506032b65700422042018aa29bd84b80800870c1af61402b31f553eec9b2577f048a5556dace1b47cd3'
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
