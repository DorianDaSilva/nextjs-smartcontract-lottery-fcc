//Shortcut to set up wallet Connect
import { ConnectButton } from "web3uikit"

export default function Header() {
    return (
        <div className="p-5 border-b-2 flex felx-row">
            <br />
            <h1 className="py-4 px-4 font-blog text-3xl">Welcome to the decentralized Raffle!!!</h1>
            <br />
            <br />
            <div className="ml-auto py-2 px-4"></div>
            <ConnectButton moralisAuth={false} />
        </div>
    )
}
