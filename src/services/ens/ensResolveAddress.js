import { getAddr } from "./ens"
import { isEthereumAddress } from "../../utils"

export const ensResolveAddress = async (domain) => {
    console.log("got here", domain)
    // check if is address or ens name string
    // if address return address
    // if ens name string do resolution and return ens name string
    if (isEthereumAddress(domain)) { return domain }
    else {
        console.log("resolving: " + domain)
        return await getAddr(domain)
        // return "0xd2536C3cc7eb51447F6dA8d60Ba6344A79590b4F"
    }
}
