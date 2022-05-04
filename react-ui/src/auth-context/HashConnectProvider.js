import React, { useEffect, useState } from 'react';

import { Spinner } from '@chakra-ui/react'

const INITIAL_SAVE_DATA = {
    topic: "",
    pairingString: "",
    privateKey: "",
    pairedAccounts: [],
    pairedWalletData: null,
};

const APP_CONFIG = {
    name: "dApp Example",
    description: "An example hedera dApp",
    icon: "https://absolute.url/to/icon.png",
};

function loadLocalData() {
    let foundData = localStorage.getItem("hashconnectData");

    if(foundData){
        return JSON.parse(foundData);
    }
    
    return null;
}

export const HashConnectAPIContext =
  React.createContext({
    connect: () => null,
    walletData: INITIAL_SAVE_DATA,
    network: "testnet",
    installedExtensions: null,
});

export default function HashConnectProvider({
    children,
    hashConnect,
    metaData,
    network,
    debug
}) {
    const [saveData, setSaveData] = useState(INITIAL_SAVE_DATA);
    const [installedExtensions, setInstalledExtensions] = useState(null);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        //Intialize the setup
        initialize();

        // Attach event handlers
        hashConnect.foundExtensionEvent.on(foundExtensionEventHandler);
        hashConnect.pairingEvent.on(pairingEventHandler);

        return () => {
            // Detach existing handlers
            hashConnect.foundExtensionEvent.off(foundExtensionEventHandler);
            hashConnect.pairingEvent.off(pairingEventHandler);
        };
    }, []);

    const initialize = async () => {
        const saveData = INITIAL_SAVE_DATA;
        const localData = loadLocalData();
        try {
            if (!localData) {
                if (debug) console.log("===Local data not found.=====");

                //first init and store the private for later
                let initData = await hashConnect.init(metaData ?? APP_CONFIG);
                saveData.privateKey = initData.privKey;

                //then connect, storing the new topic for later
                const state = await hashConnect.connect();
                saveData.topic = state.topic;

                //generate a pairing string, which you can display and generate a QR code from
                console.log(state, network, debug);
                saveData.pairingString = hashConnect.generatePairingString(
                    state,
                    network,
                    debug ?? false
                );

                //find any supported local wallets
                hashConnect.findLocalWallets();
            } else {
                if (debug) console.log("====Local data found====", localData);
                //use loaded data for initialization + connection
                await hashConnect.init(metaData ?? APP_CONFIG, localData?.privateKey);
                await hashConnect.connect(
                    localData?.topic,
                    localData?.pairedWalletData ?? metaData
                );
            }
        } catch (error) {
            console.log(error);
        } finally {
            if (localData) {
                setSaveData((prevData) => ({ ...prevData, ...localData }));
            } else {
                setSaveData((prevData) => ({ ...prevData, ...saveData }));
            }
            setHasLoaded(true);
            if (debug) console.log("====Wallet details updated to state====");
        }
    };

    const saveDataInLocalStorage = (data) => {
        if (debug) console.info("===============Saving to localstorage::=============");
        const { metadata, ...restData } = data;
        setSaveData((prevSaveData) => {
            prevSaveData.pairedWalletData = metadata;
            return { ...prevSaveData, ...restData };
        });

        let dataToSave = JSON.stringify(data);
        localStorage.setItem("hashconnectData", dataToSave);
    };

    const foundExtensionEventHandler = (data) => {
        if (debug) console.debug("====foundExtensionEvent====", data);
        // Do a thing
        setInstalledExtensions(data);
    };
    
    const pairingEventHandler = (data) => {
        if (debug) console.log("====pairingEvent:::Wallet connected=====", data);
        // Save Data to localStorage
        saveDataInLocalStorage(data);
        setConnected(true);
    };

    const connect = () => {
        if (installedExtensions) {
          if (debug) console.log("Pairing String::", saveData.pairingString);
          hashConnect.connectToLocalWallet(saveData?.pairingString);
        } else {
          if (debug) console.log("====No Extension is not in browser====");
          return "wallet not installed";
        }
    };

    if (!hasLoaded) {
        return (
            <Spinner />
        )
    }

    return (
        <HashConnectAPIContext.Provider
          value={{ connect, walletData: saveData, network, installedExtensions, hasConnected: connected }}
        >
          {children}
        </HashConnectAPIContext.Provider>
      );
};

const defaultProps = {
    metaData: {
      name: "dApp Example",
      description: "An example hedera dApp",
      icon: "https://absolute.url/to/icon.png",
    },
    network: "testnet",
    debug: false,
  };
  
HashConnectProvider.defaultProps = defaultProps;

export function useHashConnect() {
    const value = React.useContext(HashConnectAPIContext);
    return value;
}
