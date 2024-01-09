import { ethers } from 'ethers';
import {useEffect, useState} from 'react'
import styles from "../styles/Home.module.css"


export default function HomePage(){
  
  ///@dev useStates refresing the page automatically on changing its value
  const [eth, setEth] = useState('');
  const [usdt, setUsdt] = useState('');
  const [data, setData] = useState('');
  const [signer, setSigner] = useState(null);
  const [isConnected, setConncted] = useState(false);

  ///@dev getting the price or swapping info or address
  const getQuote = async() => {
    try{
      const headers = {'0x-api-key': 'e6f08dca-323d-4182-a9ae-cafbf4db4b54'};
      const req = await fetch(`https://api.0x.org/swap/v1/quote?sellToken=ETH&buyToken=USDT&sellAmount=${ethers.parseEther(eth)}`, {headers});
      const reqInJson = await req.json();
      console.log(reqInJson);
      setData(reqInJson);
      
      if(!req.ok){
        console.log(req);
        setUsdt(0)
      }else{
        // USDT has 6 decimal places
        setUsdt(reqInJson.buyAmount/1e6);
      }
    }catch(error){
      console.log(error);
    }
  }
  

  ///@dev connecting to the metamask wallet
  const connectMetaMask = async() => {
    try{
      if(window.ethereum){
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner();
        setSigner(signer);
        setConncted(true);
      }else{
        console.log("MetaMask not installed; using read-only defaults")
        provider = ethers.getDefaultProvider()    
      }
    }catch(error){
      alert('make sure you have metamask!!')
    }
  }


  ///@dev purchasing the token or swapping
  const purchaseUSDT = async() => {
    try{
      console.log(signer)
      const tx = await signer.sendTransaction({
        from: signer.address,
        to: data.to,
        data: data.data,
        value: ethers.parseEther(eth),
      })

      const receipt = await tx.wait();
      console.log(receipt);
      alert('purchase USDT susscesfully!')
    }catch(error){
      alert('purchase failed!!')
    }
  }



  ///@dev site will refresh when the isConnect is changes
  useEffect(()=>{},[isConnected]);


  ///@dev connect metamask
  if(!isConnected){
    return (<div className={styles.container}>
      <button onClick={connectMetaMask} className={styles.button}>connect wallet</button>
    </div>)
  }


  ///@dev rendering the elements into the page of next-js/index.js
  return (<div className={styles.container}>
      
      <nav className={styles.nav}>
        <h1>{`0xSwapp-(0xProtocol)`}</h1>
        <button onClick={()=>{
          setConncted(false);
        }} className={styles.button}>disconnect account</button>
      </nav>

      <div className={styles.card}>
        <h1>Purchase USDT</h1>
        <input type='number' value={eth} onChange={(e)=>{
          setEth(e.target.value)
        }} placeholder="ETH"/>
        <input type='number' value={usdt} onChange={(e)=>{
          setUsdt(e.target.value)
        }} placeholder="USDT" disabled/>
        <button onClick={getQuote} className={styles.button}>Get Details</button>
        
        {
          data && <div className={styles.detail}>
            <p>{`{`}</p>
              <p className={styles.tab}>chainId: {data.chainId}</p>
              <p className={styles.tab}>buyTokenAddress: {data.buyTokenAddress}</p>
              <p className={styles.tab}>buyTokenToEthRate: {data.buyTokenToEthRate}</p>
              <p className={styles.tab}>estimatedGas: {data.estimatedGas}</p>
              <p className={styles.tab}>gas: {data.gas}</p>
              <p className={styles.tab}>gasPrice: {data.gasPrice}</p>
              <p className={styles.tab}>price: {data.price}</p>
            <p>{`}`}</p>
          </div>
        }

        <button onClick={purchaseUSDT} className={styles.button}>Done it!</button>
      </div>
    </div>
  )
}