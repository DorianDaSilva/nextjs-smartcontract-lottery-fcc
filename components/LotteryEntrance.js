import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    //console.log(parseInt(chainIdHex))
    const chainId = parseInt(chainIdHex)
    const RaffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const [entranceFee, setEntranceFee] = useState(0)
    const [numPlayers, setNumPlayers] = useState(0)
    const [recentWinner, setRecentWinner] = useState(0)

    const dispatch = useNotification()

    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: RaffleAddress, //Specify network Id
        functionName: "enterRaffle",
        msgValue: entranceFee,
        params: {},
    })

    //if there is a chainIdHex we do this if not we do something else
    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: RaffleAddress, //Specify network Id
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: RaffleAddress, //Specify network Id
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: RaffleAddress, //Specify network Id
        functionName: "getRecentwinner",
        params: {},
    })

    async function updateUI() {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numPlayersFromCall = (await getNumberOfPlayers()).toString()
        const recentWinnerFromCall = (await getRecentWinner()).toString()
        setEntranceFee(entranceFeeFromCall)
        setNumPlayers(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            //try to read raffle entrance fee
            updateUI()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isWeb3Enabled])

    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI()
    }

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction complete!",
            title: "Tx notification",
            position: "topR",
            icon: "bell",
        })
    }

    return (
        <div className="p-5">
            <br></br>
            {RaffleAddress ? (
                <div>
                    <button
                        className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={async function () {
                            await enterRaffle({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error), //Add this to ALL runcontract functions
                            })
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            <div>Enter Raffle</div>
                        )}
                    </button>
                    <br></br>
                    <div>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
                    <div>Number Of Players: {numPlayers}</div>
                    <div>recent Winner: {recentWinner}</div>
                    <br />
                    <div>Let's get started...</div>
                </div>
            ) : (
                <div>No Raffle Address Detected<br/>*Testnet version - Hardhat localhost only*</div>
            )}
        </div>
    )
}
