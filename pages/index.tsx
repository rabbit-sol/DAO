import { ConnectWallet, useAddress, useContract, useContractRead, useContractWrite, Web3Button } from "@thirdweb-dev/react";
import { useState, useEffect } from 'react'
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import Link from 'next/link'


const DaoAddress = "0xDDe908187320A1a0B37A09786180527052902b4b"
const Home: NextPage = () => {


    const address = useAddress();
    const { contract } = useContract(DaoAddress);

    const [addressToApprove, setAddressToApprove] = useState("")
    const [proposalId, setProposalId] = useState("1")

    const { data: AppliedAddresses,  } = useContractRead(contract, "AppliedAddresses",address)
    const { data: approvedUsers, } = useContractRead(contract, "approvedUsers",address)
  
    console.log(AppliedAddresses,address)
  
    const myFunction = () => {

        if (address) {

            if (address == "0xbe257fC43bAFc6af01d8C4001a73BF3F0853d0a4") {
                return (
                    <>
                        <div className={styles.card}>
                            <p>
                                <label htmlFor="addressToApprove">Address To Approve :</label>
                                <input className={styles.card1} type="text" value={addressToApprove} id="addressToApprove" name="addressToApprove" placeholder="Address to include in DAO" onChange={e => setAddressToApprove(e.target.value)} required />
                            </p>
                            <Web3Button
                                contractAddress={DaoAddress}
                                action={(contract) => {
                                    contract.call("approveForDAO", addressToApprove)
                                }}
                            >
                                Approve Now
                            </Web3Button>
                        </div>
                        <div className={styles.card}>
                            <p>
                                <label htmlFor="proposalId">Proposal To Close :</label>
                                <input className={styles.card1} type="text" id="proposalId" value={proposalId} name="proposalId" placeholder="ID Of Proposal" onChange={e => setProposalId(e.target.value)} required />
                            </p>
                            <Web3Button
                                contractAddress={DaoAddress}
                                action={(contract) => {
                                    contract.call("closeVoting", proposalId)
                                }}
                            >
                                Close Proposal
                            </Web3Button>
                        </div>
                        <Link href="/proposal">
                            <div className={styles.card} >
                                <h2>Proposals &rarr;</h2>
                                <p>
                                    Vote on proposal or create Own Proposal now.
                                </p>
                            </div>
                        </Link>
                    </>
                )
            }
            else {

                if (AppliedAddresses || approvedUsers) {
                    return (
                    <>
                            <p>
                                You already applied for the DAO membership   </p>
                            <Link href="/proposal">
                                <div className={styles.card} >
                                    <h2>Proposals &rarr;</h2>
                                    <p>
                                        Vote on proposal or create Own Proposal now.
                                    </p>
                                </div>
                            </Link>
                        </>
                        )
                }
                return (
                    <>

                        <Web3Button
                            contractAddress={DaoAddress}
                            action={(contract) => {
                                contract.call("applyForDAO")
                            }}

                        >
                            Apply For DAO
                        </Web3Button>
                        <p>
                           Connect you wallet with mumbai testnet to apply for DAO membership;
                        </p>

                    </>
                )
            }
        }


        else {
            return (
                <>
                    <h2>Connecting... </h2>
                    <p>
                        Connect you wallet with mumbai testnet now.
                    </p>
                </>
            )
        }
    }

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h2 className={styles.title}>
                    E-DAO
                </h2>
                <Link href="/">
                    <div className={styles.card} >
                       
                        <p>
                            Home
                        </p>
                    </div>
                </Link>

                <p className={styles.description}>
                    Get started by connecting your wallet
                </p>

                <div className={styles.connect}>
                    <ConnectWallet />
                </div>

                <div className={styles.grid}>
                    <div className={styles.grid}>

                         {myFunction()}
                    </div>

                  



                </div>
            </main>
        </div>
    );
};

export default Home;

