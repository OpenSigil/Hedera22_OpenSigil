import React from "react";
import PropTypes from "prop-types";
import { HashConnect } from 'hashconnect';

const AuthContext = React.createContext(null);

export const AuthProvider = ({ userData, children }) => {
  let [user, setUser] = React.useState(userData);
  user = typeof user === "string" ? JSON.parse(user) : user;
  
  initHashconnect();

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};

let hashconnect;
    
let saveData = {
    topic: "",
    pairingString: "",
    privateKey: "",
    pairedWalletData: null,
    pairedAccounts: []
}

let appMetadata = {
    name: "dApp Example",
    description: "An example hedera dApp",
    icon: "https://www.hashpack.app/img/logo.svg"
}

async function initHashconnect() {
    //create the hashconnect instance
    hashconnect = new HashConnect();

    if(!loadLocalData()){
        //first init and store the private for later
        let initData = await hashconnect.init(appMetadata);
        saveData.privateKey = initData.privKey;

        //then connect, storing the new topic for later
        const state = await hashconnect.connect();
        saveData.topic = state.topic;
        
        //generate a pairing string, which you can display and generate a QR code from
        saveData.pairingString = hashconnect.generatePairingString(state, "testnet", true);
        
        //find any supported local wallets
        hashconnect.findLocalWallets();

        hashconnect.foundExtensionEvent.once((walletMetadata) => {
            console.log(walletMetadata);
            hashconnect.connectToLocalWallet(saveData.pairingString, walletMetadata);

            localStorage.setItem("hashconnectData", JSON.stringify(saveData))
        })
    }
    else {
        //use loaded data for initialization + connection
        await hashconnect.init(appMetadata, saveData.privateKey);
        await hashconnect.connect(saveData.topic, saveData.pairedWalletData);

        console.log('test?')
    }
}

function loadLocalData() {
    let foundData = localStorage.getItem("hashconnectData");

    if(foundData){
        saveData = JSON.parse(foundData);
        return true;
    }
    else
        return false;
}

AuthProvider.propTypes = {
  userData: PropTypes.any,
  children: PropTypes.any,
};

export const useAuth = () => React.useContext(AuthContext);
