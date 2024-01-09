import { ethers } from 'ethers';
import {useEffect, useState} from 'react'


export default function HomePage(){
  
  ///@dev useStates refresing the page automatically on changing its value
  const [eth, setEth] = useState('');
  const [usdt, setUsdt] = useState('');
  const [data, setData] = useState('');
  const [signer, setSigner] = useState(null);

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
        console.log(signer.address)
        setSigner(signer);
      }else{
        console.log("MetaMask not installed; using read-only defaults")
        provider = ethers.getDefaultProvider()    
      }
    }catch(error){
      console.log(error);
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
      console.log('purchasing')

      const receipt = await tx.wait();
      console.log(receipt);
      alert('purchase USDT susscesfully!')
    }catch(error){
      console.log('error purchasing USDT');
    }
  }

  ///@dev on rendering the page or refresing, trying of connect to metamask
  useEffect(()=>{
    connectMetaMask();
  },[])

  ///@dev rendering the elements into the page of next-js/index.js
  return (<div style={{
      display: 'flex', 
      alignItems: 'center', 
      flexDirection: 'column',
      justifyContent: 'center',
      height:'100vh'}}>

      <h1>Purchase USDT</h1>
      <input type='number' value={eth} onChange={(e)=>{
        setEth(e.target.value)
      }} placeholder="ETH"
        style={{height: '3vh',
          width: '15vw',
          padding: '10px',}}/>
      <input type='number' value={usdt} onChange={(e)=>{
        setUsdt(e.target.value)
      }} placeholder="USDT"
        disabled
        style={{height: '3vh',
          width: '15vw',
          padding: '10px',}}/>
      <button onClick={getQuote}>fetch it!!</button>
      <button onClick={purchaseUSDT}>purchase it!!</button>
    </div>
  )
}