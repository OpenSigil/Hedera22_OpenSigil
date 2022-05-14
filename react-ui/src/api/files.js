import axios from "./index";

class FilesApi {
  static Upload = (file, accountId, useWeb3) => {
    let form = new FormData();
    form.append("data", file);

    if (useWeb3) {
      return axios.post(`${base}/upload`, form, {
        headers: {
          "ACCOUNT-ID": accountId,
          "PUBLIC-KEY": "ForDemoPurposesOnly!",
          "PRIVATE-KEY": "302e020100300506032b65700422042018aa29bd84b80800870c1af61402b31f553eec9b2577f048a5556dace1b47cd3"
        },
        responseType: "arraybuffer"
      });
    }
    else {
      return axios.post(`${base}/hedera-encrypt`, form, {
        headers: {
          "ACCOUNT-ID": accountId,
          "PUBLIC-KEY": "ForDemoPurposesOnly!",
          "PRIVATE-KEY": "302e020100300506032b65700422042018aa29bd84b80800870c1af61402b31f553eec9b2577f048a5556dace1b47cd3"
        },
        responseType: "arraybuffer"
      });
    }
  };

  static Download = (accountId, contractId) => {
    return axios.post(`${base}/download`, null, {
      headers: {
        "ACCOUNT-ID": accountId,
        "CONTRACT-ID": contractId,
        "PUBLIC-KEY": "ForDemoPurposesOnly!",
        "PRIVATE-KEY": "302e020100300506032b65700422042018aa29bd84b80800870c1af61402b31f553eec9b2577f048a5556dace1b47cd3"
      },
      responseType: "arraybuffer"
    });
  };

  static Decrypt = (file, accountId) => {
    let form = new FormData();
    form.append("data", file);
    
    return axios.post(`${base}/hedera-decrypt`, form, {
      headers: {
        "ACCOUNT-ID": accountId,
        "CONTRACT-ID": "0.0.34730084"
      },
      responseType: "arraybuffer"
    });
  };

  static ListFiles = (accountId) => {
    return axios.post(`${base}/get-record`, null, {
      headers: {
        "ACCOUNT-ID": accountId
      }
    });
  };

  static ListAccess = (contractId) => {
    return axios.post(`${base}/list-access`, null, {
      headers: {
        "CONTRACT-ID": contractId
      }
    });
  };

  static AddAccess = (contractId, accountId) => {
    return axios.post(`${base}/add-access`, null, {
      headers: {
        "CONTRACT-ID": contractId,
        "ACCOUNT-ID": accountId
      }
    });
  };

  static RevokeAccess = (contractId, accountId) => {
    return axios.post(`${base}/revoke-access`, null, {
      headers: {
        "CONTRACT-ID": contractId,
        "ACCOUNT-ID": accountId
      }
    });
  };
}

let base = "sigil";

export default FilesApi;
