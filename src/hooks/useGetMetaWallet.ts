import { useEffect, useState } from "react";
import { MetaWallet } from "../MetaWallet";

export default function useGetMetaWallet() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [wallet, setWallet] = useState<MetaWallet>();

    useEffect(() => {
        setWallet(new MetaWallet());
        setIsLoading(false);
    }, [])

    return { zeroWallet: wallet, isLoading };

}