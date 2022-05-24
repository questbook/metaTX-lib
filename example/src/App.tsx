import React from 'react';
import { useState } from 'react';
import { MetaWallet, MetaContract } from 'meta-tx';
import { AbiItem } from 'meta-tx/src/types/MetaContractTypes';
import './App.css';

const abi: Array<AbiItem> = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "executor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "onBehalfOf",
				"type": "address"
			}
		],
		"name": "MsgSender",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "execute",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

// const contractAddress = "0xaBE6F798CE83407BBf103e1C1454E1453b9C1148" Old gasless contract
const contractAddress = "0x810037e1E5d0cd94de87632c37Cdc97502731b28"; // With struct Signature

function App() {
	const [tx, setTx] = useState<string>();

	const executeFunction = async function () {
		setTx("Creating a new wallet")

		let new_wallet = new MetaWallet();

		await new Promise(resolve => setTimeout(resolve, 1000));
		console.log("New wallet address " + new_wallet.address)

		setTx("Attaching 'questbook' relayer to the wallet")

		new_wallet.attachGasStation('questbook', 
		'https://vq7xis18f6.execute-api.ap-south-1.amazonaws.com/v0/transaction')

		new_wallet.attachGasStation('questbook_local', 
		'http://localhost:3001/v0/transaction');

		await new Promise(resolve => setTimeout(resolve, 1000));

		let contract = new MetaContract();

		// contract.polygon(abi, contractAddress)
        contract.ethereum(abi, contractAddress);

		let contractWithWallet = contract.attach(new_wallet);

		setTx("Submitting gasless transaction ...");
		let response = await contractWithWallet
			.on("ethereum")
			.to("questbook_local")
			.execute(contractAddress, 9);

		await new Promise(resolve => setTimeout(resolve, 1000));

		setTx("Created Tx on chain : " + response.data.hash);
	}

	const handleExecuteFunction = async function () {
		setTx("Creating a new wallet")

		let new_wallet = new MetaWallet();

		await new Promise(resolve => setTimeout(resolve, 1000));
		console.log("New wallet address " + new_wallet.address)

		setTx("Attaching 'questbook' relayer to the wallet")

		new_wallet.attachGasStation('questbook', 'http://localhost:3001/')

		await new Promise(resolve => setTimeout(resolve, 1000));

		let contract = new MetaContract();

		contract.polygon(abi, contractAddress)

		let contractWithWallet = contract.attach(new_wallet);

		setTx("Submitting gasless transaction ...")
		let response = await contractWithWallet
			.on("polygon")
			.to("questbook")
			.handleExecute(new_wallet.address, contractAddress, 10, 21000);

		await new Promise(resolve => setTimeout(resolve, 1000));

		setTx("Created Tx on chain : " + response.data.txHash);
	}

	return (
		<div className="App">
			<header className="App-header">
				<button className="execute-button"onClick={() => executeFunction()}>Create a transaction to execute</button>
				{/* <button onClick={() => handleExecuteFunction()}>Create a transaction to handleExecute</button> */}
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					{tx}
				</a>
			</header>
		</div>
	);
}

export default App;
