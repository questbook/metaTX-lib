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
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Value",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "msgData",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "testUint",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

const contractAddress = "0xa6Aca9B9dc8fC972F52E8852E5adEd0dF91f404E"

function App() {
	const [tx, setTx] = useState<string>();

	const executeFunction = async function () {
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

		setTx("Submitting gasless transaction ...");
		let response = await contractWithWallet
			.on("polygon")
			.to("questbook")
			.testUint(9);

		await new Promise(resolve => setTimeout(resolve, 1000));

		setTx("Created Tx on chain : " + response.data.txHash);
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
				<button onClick={() => executeFunction()}>Create a transaction to execute</button>
				<button onClick={() => handleExecuteFunction()}>Create a transaction to handleExecute</button>
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
