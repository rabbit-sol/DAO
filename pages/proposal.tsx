import { ConnectWallet, useAddress, useContract, useContractRead, useContractWrite, Web3Button } from "@thirdweb-dev/react";
import { useState, useEffect } from 'react'
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import Link from 'next/link'

const DaoAddress = "0xDDe908187320A1a0B37A09786180527052902b4b"

const Proposal: NextPage = () => {

    const { contract } = useContract(DaoAddress);
    const address = useAddress();

    const [proposal, setProposal] = useState("")
    const [desc, setDesc] = useState("")
    const [proposalId, setProposalId] = useState("0")
    const [status, setStatus] = useState("")

    const { data: approvedUser } = useContractRead(contract, "approvedUsers", address)
    const totalProposals= useContractRead(contract, "totalProposals")
    const { data: allProposalData, isLoading } = useContractRead(contract, "allProposals", proposalId)
    const { mutateAsync: voteForProposal, } = useContractWrite(contract, "voteForProposal")


    let proposalCount, proposalName, proposalDesc, proposalOwner, yesVote, noVote,proposalFinished

    if (allProposalData == undefined) {
        console.log("loading")
    }
    else {
     
        proposalCount = allProposalData[0]?.toNumber()
        proposalName = allProposalData[1]
        proposalDesc = allProposalData[2]
        proposalOwner = allProposalData[3].substring(0, 12)
        yesVote = allProposalData[4]?.toNumber()
        noVote = allProposalData[5]?.toNumber()
        proposalFinished = allProposalData[6]?.toString()
    }

    console.log(proposalCount, totalProposals)
    
    console.log(proposalOwner)
    console.log(proposalFinished)


    const vote = async (_vote:any) => {
        try {
            const data = await voteForProposal([proposalId, _vote]);
            console.info("contract call successs", data);
        }
        catch (e) {

            ``
            setStatus(e.reason)
        }
    }


    const myFunction = () => {

       
        return (

        
                    <> <p>
                        <label htmlFor="proposal">HeadLines: </label>
                        <input className={styles.card1} type="text" value={proposal} name="proposal" placeholder="Topic of Proposal" onChange={e => setProposal(e.target.value)} required/>
                    </p> <p>
                            <label htmlFor="description">Description: </label>
                            <input className={styles.card1} type="text" value={desc} name="description" placeholder="Desc of Proposal" onChange={e => setDesc(e.target.value)} required />
                    </p>
                        <Web3Button
                            className={styles.buttonmy}
                            contractAddress={DaoAddress}
                            action={(contract) => {
                                contract.call("createProposal", proposal,desc)
                            }}
                        >
                            New Proposal
                        </Web3Button> 
                    </>
                )}

    useEffect(() => {
        const init = async () => {

        }

        init()
    }, [])

  
    return (


        <div className={styles.container}>
            <main className={styles.main}>
                <div className={styles.grid}>
                    <Link href="/">
                        <div className={styles.card} >

                            <p>
                                Home
                            </p>
                        </div>
                    </Link>
                    <div className={styles.card}>
                        <ConnectWallet />
                    </div>

                 </div>
               
                <div className={styles.card}>
                    <h2 className={styles.title1}>
                        Create Proposal
                    </h2>
                    {myFunction()}

                </div>
                <div>
                
                <div className={styles.grid}>
                     proposalId
                    <div className={styles.card}>
                            <div className={styles.card}>
                                <h3 className={styles.title1}>
                                    Vote on Any Proposal By id

                                </h3>
                                <label htmlFor="proposalId">Choose Id to vote: </label>
                                <input className={styles.card1} type="number" value={proposalId} name="proposalid" placeholder="Proposal ID" onChange={e => setProposalId(e.target.value)} required />
                                {status}
                            </div>
                        <h2 className={styles.title1}>
                                {proposalCount}: {proposalName}
                            </h2>
                            <p style={{ fontSize: "1rem" }}>Description: {proposalDesc} </p>
                     <div className={styles.grid}>
                                <button onClick={() => vote(1)} className={styles.buttongreen}>
                                    Yes {yesVote}
                            </button>
                                <button onClick={() => vote(0)} className={styles.buttonred}>
                                    No  {noVote}
                            </button>
                       </div>
                        <p>
                                Proposed By: {proposalOwner}....
                            </p>
                        <p>
                                 Finished:{proposalFinished}
                        </p>
                    </div>
                 

                    </div>
                      
                    </div>
            </main>
        </div>
    );
};

export default Proposal;
