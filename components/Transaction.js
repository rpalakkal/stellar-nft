import React, {useState, useEffect} from 'react'
import {nftInfoState, publicKeyState, currentStepState, isTransactingState} from '../recoil/atoms'
import {stellarNetworkState} from '../recoil/selectors'
import {useRecoilValue, useRecoilState, useSetRecoilState} from 'recoil'
import {generateNFT, generateTransactionXDR, getAccountBalance}  from '../utils/stellar'
import albedo from '@albedo-link/intent'

const Transaction = (props) => {
    const [nftInfo, setNftInfo] = useRecoilState(nftInfoState)
    const [errorText, setErrorText] = useState("");
    const stellarNetwork = useRecoilValue(stellarNetworkState);
    const publicKey = useRecoilValue(publicKeyState);
    const setStep = useSetRecoilState(currentStepState);
    const setIsTransacting = useSetRecoilState(isTransactingState);
    const [accountBalance, setAccountBalance] = useState(0);

    useEffect(async () => {
        if(publicKey){
            const balance = await getAccountBalance(publicKey, stellarNetwork);
            if(balance) setAccountBalance(balance);
        }
        if(errorText!=""){
            if(balance < 2){
                setErrorText("Insufficient funds: account must have 2 XLM");
                return;
            }
            await onClick();
        }  
    }, [publicKey]);

    const onClick = async () => {
        if(!publicKey){
            setErrorText("Please connect account!");
            return;
        }
        const balance = await getAccountBalance(publicKey, stellarNetwork);
        if(!balance || balance < 2){
            setErrorText("Insufficient funds: account must have 2 XLM");
            return;
        }
        setIsTransacting(true);
        const xdr = await generateTransactionXDR(nftInfo, stellarNetwork, publicKey)
        // console.log(xdr)
        const txRes = await albedo.tx({
            xdr,
            network: 'testnet',
            submit: true
        })
        if(txRes.result.successful){
            const transactionResponse = await generateNFT(nftInfo, stellarNetwork, publicKey)
            if(transactionResponse.transactionOutput.successful){
                setNftInfo({...nftInfo, ipfsHash: transactionResponse.ipfsHash, txId: transactionResponse.transactionOutput.id})
                setStep(4);
            }

        }
        setIsTransacting(false);
    }

    return(
        <div className="flex flex-col items-center justify-center">
            <div className="flex space-x-5 py-3">
                <div className="flex flex-col">
                    <div className="flex justify-end">Current Balance: </div>
                    <div className="flex justify-end">NFT Minting Cost: </div>
                    <div className="flex justify-end">Balance After: </div>
                </div>
                <div className="flex flex-col">
                    <div className="flex justify-end">{accountBalance ? accountBalance.toString().match(/^-?\d+(?:\.\d{0,3})?/)[0] : "0.000"} XLM</div>
                    <div className="flex justify-end">2.000 XLM</div>
                    <div className="flex justify-end">{accountBalance ? (accountBalance-2).toString().match(/^-?\d+(?:\.\d{0,3})?/)[0] : "-2.000"} XLM</div>
                </div>
            </div>
            <button className="p-2 rounded border border-gray-500 bg-gray-300 hover:bg-gray-400" onClick={onClick}>
                Purchase
            </button>
            <div className="py-3 text-red-700">{errorText}</div>
        </div>
    )
}

export default Transaction;